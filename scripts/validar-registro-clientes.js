#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// scripts/validar-registro-clientes.js
// FASE 27 — MAU-3 (Fuente Dinámica de Registro de Clientes), primera etapa.
//
// PROPÓSITO
// Detectar divergencias entre las carpetas reales de clientes en
// public/clientes/{slug}/ y las entradas registradas en
// data/clientes/index.json — el problema evidenciado por el caso `caracas`
// (FASE 25/27): una invitación pública y funcional que no figuraba en el
// registro operativo, sin que nada en el sistema lo señalara.
//
// ALCANCE
// Solo lectura. No modifica public/clientes/ ni data/clientes/index.json.
// No se ejecuta en build ni en runtime — es una herramienta manual de
// verificación, pensada para correrse al cierre de cada fase que agregue
// o modifique clientes.
//
// QUÉ REPORTA
// 1. Huérfanos de registro: carpetas en public/clientes/ sin entrada
//    correspondiente en index.json, y sin marca explícita de fixture.
// 2. Huérfanos de filesystem: entradas en index.json cuyo slug no tiene
//    carpeta en public/clientes/.
// 3. slug: "admin" en el registro (reservado por el router — CONTRATO.md §6).
// 4. Carpetas excluidas explícitamente: huérfanas de registro cuyo
//    config.json declara "_fixture": true — se listan aparte, de forma
//    visible, y no cuentan como hallazgo ni afectan el exit code.
//    (FASE 27, segunda corrección — ver docs/Fase 27.md.)
//
// EXCLUSIÓN DE FIXTURES — DISEÑO
// La marca "_fixture": true vive en el propio config.json de la carpeta,
// no en una lista externa ni hardcodeada en este script. Esto la hace
// auditable por artefacto: quien abre la carpeta ve por qué está excluida,
// sin depender de este código. Comportamiento fail-safe explícito: si el
// config.json no existe, no es JSON válido, o no tiene el campo, la
// carpeta NUNCA se excluye — se reporta como huérfano real. La ausencia
// de evidencia de fixture nunca se interpreta como fixture.
//
// QUÉ NO HACE (fuera de alcance explícito de esta etapa)
// No valida el contenido de config.json contra el Contrato Ejecutable
// de Configuración (MAU-1) — esa validación ya existe en useConfig.js/
// AdminPage.jsx y es responsabilidad de esa capa, no de este script.
// La lectura de "_fixture" es puntual y no reemplaza esa validación.
// No escribe ni corrige nada automáticamente.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PUBLIC_CLIENTES = path.join(ROOT, 'public', 'clientes');
const INDEX_JSON = path.join(ROOT, 'data', 'clientes', 'index.json');

function carpetasDeClientes() {
  return readdirSync(PUBLIC_CLIENTES).filter(nombre => {
    const ruta = path.join(PUBLIC_CLIENTES, nombre);
    return statSync(ruta).isDirectory();
  });
}

function slugsDelRegistro() {
  const raw = readFileSync(INDEX_JSON, 'utf-8');
  const data = JSON.parse(raw);
  return data.clientes.map(c => c.slug);
}

// Fail-safe: cualquier duda (archivo ausente, JSON inválido, campo
// ausente o distinto de `true`) resuelve a `false` — nunca se excluye
// una carpeta salvo marca explícita y válida.
function esFixture(slug) {
  const rutaConfig = path.join(PUBLIC_CLIENTES, slug, 'config.json');
  try {
    const raw = readFileSync(rutaConfig, 'utf-8');
    const data = JSON.parse(raw);
    return data._fixture === true;
  } catch {
    return false;
  }
}

function main() {
  const carpetas = carpetasDeClientes();
  const registrados = slugsDelRegistro();

  const huerfanos = carpetas.filter(slug => !registrados.includes(slug));
  const sinRegistroExcluidos = huerfanos.filter(slug => esFixture(slug));
  const sinRegistro = huerfanos.filter(slug => !esFixture(slug));
  const sinCarpeta  = registrados.filter(slug => !carpetas.includes(slug));
  const slugReservado = registrados.includes('admin');

  console.log('── Validación de registro de clientes — VELA ──\n');
  console.log(`Carpetas en public/clientes/: ${carpetas.length}`);
  console.log(`Entradas en data/clientes/index.json: ${registrados.length}\n`);

  let huboHallazgos = false;

  if (sinRegistro.length > 0) {
    huboHallazgos = true;
    console.log('⚠ Carpetas sin entrada en el registro (huérfanos de registro):');
    sinRegistro.forEach(slug => console.log(`  - ${slug}`));
    console.log('');
  }

  if (sinRegistroExcluidos.length > 0) {
    console.log('ℹ Carpetas excluidas explícitamente (marcadas como fixture técnico, "_fixture": true):');
    sinRegistroExcluidos.forEach(slug => console.log(`  - ${slug}`));
    console.log('');
  }

  if (sinCarpeta.length > 0) {
    huboHallazgos = true;
    console.log('⚠ Entradas del registro sin carpeta en public/clientes/ (huérfanos de filesystem):');
    sinCarpeta.forEach(slug => console.log(`  - ${slug}`));
    console.log('');
  }

  if (slugReservado) {
    huboHallazgos = true;
    console.log('⚠ El slug "admin" está presente en el registro — reservado por el router (CONTRATO.md §6).\n');
  }

  if (!huboHallazgos) {
    console.log('✓ Sin divergencias que requieran atención. Todas las carpetas de public/clientes/ están registradas o excluidas explícitamente.\n');
  }

  // Código de salida distinto de cero si hay hallazgos, para uso futuro en
  // pipelines manuales o pre-commit — no se conecta a ningún proceso
  // automático en esta etapa.
  process.exit(huboHallazgos ? 1 : 0);
}

main();
