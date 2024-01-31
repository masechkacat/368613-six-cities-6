export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  CliApplication: Symbol.for('CliApplication'),
  HelpCommand: Symbol.for('HelpCommand'),
  VersionCommand: Symbol.for('VersionCommand'),
  ImportCommand: Symbol.for('ImportCommand'),
  GenerateCommand: Symbol.for('GenerateCommand'),
  FileReader: Symbol.for('FileReader'),
  FileWriter: Symbol.for('FileWriter'),
  OfferGenerator: Symbol.for('OfferGenerator'),
  TSVFileReaderFactory: Symbol.for('TSVFileReaderFactory'),
} as const;
