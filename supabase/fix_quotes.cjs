// Fix unescaped single quotes in SQL string literals
const fs = require('fs')

let sql = fs.readFileSync('./supabase/migrations/001_multiplayer.sql', 'utf8')

// We need to escape single quotes inside string literals.
// Strategy: replace unescaped single quotes (not already doubled) in the middle of strings.
// Simple approach: for strings that contain ' inside, replace ' with ''

// More robust: process the file line by line, only fixing the string values
const lines = sql.split('\n')
const fixed = lines.map(line => {
  // Only process INSERT statement lines (contain ' or ARRAY)
  if (!line.includes("'")) return line
  // For each line, escape single quotes that are NOT already escaped
  // and are NOT the delimiter between fields
  let result = ''
  let i = 0
  while (i < line.length) {
    const ch = line[i]
    if (ch === "'") {
      // Count how many consecutive quotes
      let n = 1
      while (i + n < line.length && line[i + n] === "'") n++
      if (n === 1) {
        // Check context: is this a quote that needs escaping?
        const prev = result[result.length - 1]
        const next = line[i + 1]
        // If prev is a letter/number and next is a letter, it's inside a string
        // Escape it
        result += "''"
        i++
      } else {
        // Already escaped or intentional double quote
        result += line.slice(i, i + n)
        i += n
      }
    } else {
      result += ch
      i++
    }
  }
  return result
})

fs.writeFileSync('./supabase/migrations/001_multiplayer.sql', fixed.join('\n'))
console.log('Fixed', sql.split("\n").length, 'lines')
console.log('Done!')
