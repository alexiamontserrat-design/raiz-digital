#!/usr/bin/env node
// =============================================================================
// create-first-admin.js — Raíz Digital
// Crea el primer administrador en PostgreSQL de forma interactiva y segura.
//
// USO:  node scripts/create-first-admin.js
//
// Requisitos:
//   - .env.local con DATABASE_URL configurado en la raíz del proyecto
//   - Migración 001 ya aplicada (columnas estado, token_version)
//   - Solo puede ejecutarse una vez: se detiene si ya existe un admin
//
// Seguridad:
//   - La contraseña NO se muestra en pantalla (modo raw de terminal)
//   - El hash bcrypt se genera en memoria, nunca se imprime ni registra
//   - DATABASE_URL se lee de .env.local, no de argumentos de CLI
//   - Los errores de PostgreSQL se reportan solo por código, sin mensajes internos
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Rutas relativas al repositorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

// Cargar dependencias CJS del proyecto mediante require (necesario para pg y bcryptjs)
const require = createRequire(import.meta.url);
const bcrypt = require(path.join(REPO_ROOT, "node_modules", "bcryptjs"));
const { Pool } = require(path.join(REPO_ROOT, "node_modules", "pg"));

// ---------------------------------------------------------------------------
// Leer DATABASE_URL desde .env.local
// ---------------------------------------------------------------------------
function loadDatabaseUrl() {
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error("No se encontró .env.local en la raíz del proyecto.");
  }
  const content = fs.readFileSync(envPath, "utf8");
  const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
  if (!match) {
    throw new Error("DATABASE_URL no encontrada en .env.local.");
  }
  return match[1].trim();
}

// ---------------------------------------------------------------------------
// Leer una línea del usuario con prompt visible
// ---------------------------------------------------------------------------
function readLine(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ---------------------------------------------------------------------------
// Leer contraseña sin mostrarla en pantalla (modo raw de terminal)
// Soporta: Backspace, Ctrl+C, Enter/Return.
// ---------------------------------------------------------------------------

function readPassword(prompt) {
  return new Promise((resolve, reject) => {
    process.stdout.write(prompt);

    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      process.stdout.write("\n");
      reject(new Error(
        "La contraseña debe introducirse desde una terminal interactiva."
      ));
      return;
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let password = "";


    function onKey(char) {
      if (char === "\u0003") {
        // Ctrl+C
        cleanup();
        process.stdout.write("\n[Cancelado]\n");
        process.exit(0);
      } else if (char === "\r" || char === "\n" || char === "\u0004") {
        cleanup();
        process.stdout.write("\n");
        resolve(password);
      } else if (char === "\u007F" || char === "\b") {
        // Backspace
        password = password.slice(0, -1);
      } else if (char >= " ") {
        password += char;
      }
    }

    function cleanup() {
      process.stdin.removeListener("data", onKey);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }

    process.stdin.on("data", onKey);
  });
}

// ---------------------------------------------------------------------------
// Validaciones de campos
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateNombre(nombre) {
  if (!nombre || nombre.length < 2) return "El nombre debe tener al menos 2 caracteres.";
  if (nombre.length > 100) return "El nombre no puede superar los 100 caracteres.";
  return null;
}

function validateCorreo(correo) {
  if (!correo) return "El correo es obligatorio.";
  if (!EMAIL_RE.test(correo)) return "El formato del correo no es válido.";
  if (correo.length > 254) return "El correo no puede superar los 254 caracteres.";
  return null;
}


function validateContrasena(contrasena) {
  if (!contrasena) return "La contraseña es obligatoria.";
  if (contrasena.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (contrasena.length > 128) return "La contraseña no puede superar los 128 caracteres.";
  if (!/[A-Z]/.test(contrasena)) return "La contraseña debe contener al menos una letra mayúscula.";
  if (!/[a-z]/.test(contrasena)) return "La contraseña debe contener al menos una letra minúscula.";
  if (!/[0-9]/.test(contrasena)) return "La contraseña debe contener al menos un número.";
  return null;
}


// ---------------------------------------------------------------------------
// Programa principal
// ---------------------------------------------------------------------------
async function main() {
  console.log("=============================================================");
  console.log("  Raíz Digital — Creación del primer administrador");
  console.log("=============================================================\n");

  // 1. Cargar DATABASE_URL y conectar
  let databaseUrl;
  try {
    databaseUrl = loadDatabaseUrl();
  } catch (err) {
    console.error(`\n[ERROR] ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl, max: 1 });

  try {
    await pool.query("SELECT 1");
  } catch {
    console.error("\n[ERROR] No se pudo conectar a PostgreSQL. Verifica DATABASE_URL y que el servidor esté activo.");
    await pool.end();
    process.exit(1);
  }

  // 2. Comprobar que no existe ningún admin
  let adminCount = 0;
  try {
    const res = await pool.query(
      "SELECT COUNT(*)::int AS total FROM usuarios WHERE rol = $1",
      ["admin"],
    );
    adminCount = res.rows[0].total;
  } catch {
    console.error("\n[ERROR] No se pudo consultar la tabla usuarios. Verifica que la migración 001 esté aplicada.");
    await pool.end();
    process.exit(1);
  }

  if (adminCount > 0) {
    console.log(`\n⚠️  Ya existe ${adminCount} administrador(es) en el sistema.`);
    console.log("   Este script solo puede ejecutarse cuando no existe ningún admin.");
    console.log("   No se realizaron cambios.\n");
    await pool.end();
    process.exit(0);
  }

  console.log("No se encontraron administradores. Puedes continuar.\n");

  // 3. Recolectar datos interactivamente
  const nombre = await readLine("Nombre completo   : ");
  const errNombre = validateNombre(nombre);
  if (errNombre) {
    console.error(`\n[ERROR] ${errNombre}`);
    await pool.end();
    process.exit(1);
  }

  const correo = await readLine("Correo electrónico: ");
  const errCorreo = validateCorreo(correo);
  if (errCorreo) {
    console.error(`\n[ERROR] ${errCorreo}`);
    await pool.end();
    process.exit(1);
  }

  const contrasena = await readPassword("Contraseña        : ");
  const errContrasena = validateContrasena(contrasena);
  if (errContrasena) {
    console.error(`\n[ERROR] ${errContrasena}`);
    await pool.end();
    process.exit(1);
  }

  const contrasenaConfirm = await readPassword("Confirmar         : ");
  if (contrasena !== contrasenaConfirm) {
    console.error("\n[ERROR] Las contraseñas no coinciden.");
    await pool.end();
    process.exit(1);
  }

  // 4. Generar hash bcrypt (factor 12 — compatible con login actual)
  console.log("\n  Generando hash de seguridad...");
  let hash;
  try {
    hash = await bcrypt.hash(contrasena, 12);
  } catch {
    console.error("\n[ERROR] Fallo al generar el hash de la contraseña.");
    await pool.end();
    process.exit(1);
  }

  // 5. Confirmar antes de insertar
  console.log("\n-------------------------------------------------------------");
  console.log("  Resumen del administrador a crear:");
  console.log(`    Nombre : ${nombre}`);
  console.log(`    Correo : ${correo.toLowerCase()}`);
  console.log(`    Rol    : admin`);
  console.log(`    Estado : activo`);
  console.log("-------------------------------------------------------------");

  const confirmacion = await readLine("\n¿Confirmas la creación? (s/n): ");
  if (confirmacion.toLowerCase() !== "s") {
    console.log("\n[Cancelado] No se realizaron cambios.\n");
    await pool.end();
    process.exit(0);
  }



  // 6. Crear el administrador dentro de una transacción protegida
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Evita crear dos administradores simultáneamente
    await client.query(
      "LOCK TABLE usuarios IN SHARE ROW EXCLUSIVE MODE"
    );

    const result = await client.query(
      `INSERT INTO usuarios
         (nombre, correo, contrasena, rol, estado, token_version)
       SELECT $1, $2, $3, 'admin', 'activo', 1
       WHERE NOT EXISTS (
         SELECT 1 FROM usuarios WHERE rol = 'admin'
       )
       RETURNING id_usuario`,
      [nombre, correo.toLowerCase(), hash]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      console.log(
        "\nYa existe un administrador. No se realizaron cambios."
      );
      return;
    }

    await client.query("COMMIT");

    console.log(
      `\nAdministrador creado correctamente (ID: ${result.rows[0].id_usuario}).`
    );
    console.log("Puedes iniciar sesión en /login.");

  } catch (err) {
    await client.query("ROLLBACK").catch(() => { });

    const code =
      err && typeof err === "object" && "code" in err
        ? err.code
        : "UNKNOWN";

    console.error(
      `\nNo se pudo crear el administrador (código: ${code}).`
    );

    process.exitCode = 1;

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(() => {
  console.error(
    "\n[ERROR] No se pudo completar la operación."
  );
  process.exitCode = 1;
});

