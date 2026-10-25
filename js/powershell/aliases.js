/**
 * Алиасы PowerShell: ls → Get-ChildItem, ps → Get-Process и т.д.
 */

export const aliases = {
  // File system
  ls: 'Get-ChildItem',
  dir: 'Get-ChildItem',
  gci: 'Get-ChildItem',
  cd: 'Set-Location',
  sl: 'Set-Location',
  pwd: 'Get-Location',
  gl: 'Get-Location',
  cat: 'Get-Content',
  gc: 'Get-Content',
  type: 'Get-Content',
  echo: 'Write-Output',
  write: 'Write-Output',

  // Filter / sort
  where: 'Where-Object',
  '?': 'Where-Object',
  select: 'Select-Object',
  sort: 'Sort-Object',

  // Loop
  foreach: 'ForEach-Object',
  '%': 'ForEach-Object',

  // Measure
  measure: 'Measure-Object',

  // Process / service
  ps: 'Get-Process',
  gps: 'Get-Process',
  gsv: 'Get-Service',

  // Remove
  rm: 'Remove-Item',
  del: 'Remove-Item',
  ri: 'Remove-Item',

  // Clear
  cls: 'Clear-Host',
  clear: 'Clear-Host',

  // Help
  help: 'Get-Help',
  man: 'Get-Help',

  // Member
  gm: 'Get-Member',

  // Format
  ft: 'Format-Table',
  fl: 'Format-List',

  // Search
  sls: 'Select-String',

  // New
  ni: 'New-Item',

  // Set content
  sc: 'Set-Content',
  ac: 'Add-Content',

  // Stop
  kill: 'Stop-Process',

  // Group
  group: 'Group-Object',

  // Command
  gcm: 'Get-Command',

  // Date
  date: 'Get-Date'
};

/** Разрешить алиас в полное имя командлета. */
export function resolveAlias(name) {
  const lower = name.toLowerCase();
  return aliases[lower] || null;
}
