import { describe, it, expect, beforeEach } from 'vitest'
import { parseYoutubeId } from '../src/youtube'
import { clampDb, matchPreset, PRESETS, loadEqSettings, saveEqSettings, BANDS } from '../src/audio/eq'
import { formatTime } from '../src/util'
import { toTrack } from '../src/api'

describe('parseYoutubeId', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtube.com/watch?v=dQw4w9WgXcQ&t=10', 'dQw4w9WgXcQ'],
    ['https://m.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?si=abc', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://example.com/watch?v=x', null],
    ['hola', null]
  ])('%s', (input, out) => expect(parseYoutubeId(input)).toBe(out))
})

describe('equalizer settings', () => {
  beforeEach(() => localStorage.clear())
  it('clamps gains to ±12 dB', () => {
    expect(clampDb(20)).toBe(12)
    expect(clampDb(-30)).toBe(-12)
    expect(clampDb('x')).toBe(0)
  })
  it('recognises presets', () => {
    expect(matchPreset(PRESETS.rock.gains)).toBe('rock')
    expect(matchPreset([1, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe('custom')
  })
  it('every preset has one gain per band', () => {
    for (const p of Object.values(PRESETS)) expect(p.gains).toHaveLength(BANDS.length)
  })
  it('persists settings', () => {
    expect(loadEqSettings().gains).toEqual(PRESETS.flat.gains)
    saveEqSettings({ enabled: false, preamp: -3, gains: PRESETS.bass.gains })
    expect(loadEqSettings()).toEqual({ enabled: false, preamp: -3, gains: PRESETS.bass.gains })
  })
})

describe('helpers', () => {
  it('formats time', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(185)).toBe('3:05')
    expect(formatTime(NaN)).toBe('0:00')
  })
  it('normalises backend tracks', () => {
    const t = toTrack({ id: 1, title: 'A', file: 'http://x/a.mp3', thumbnail: null, duration: 10, artists: [{ alias: 'DJ' }] })
    expect(t).toMatchObject({ id: 1, title: 'A', src: 'http://x/a.mp3', artist: 'DJ', cover: null })
    expect(toTrack({ id: 2, title: 'B', file: 'f', artists: [] }).artist).toBe('Desconocido')
  })
})
