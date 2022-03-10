import Hangul from 'hangul-js'

export const toUniCode = (text, split = '\\') => {
  let unicode = ''
  Hangul.disassemble(text).map((char) => {
    unicode += split + char.charCodeAt(0).toString(16)
  })
  return unicode
}

export const toChoUniCode = (text, split = '\\') => {
  let unicode = ''
  Hangul.disassemble(text, true).map((char) => {
    unicode += split + char[0].charCodeAt(0).toString(16)
  })
  return unicode
}

toChoUniCode('시발')
