import { phoneSpecsFixtures } from '@/test/fixtures'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Specifications } from './Specifications'

describe('Specifications', () => {
  it('renders a region labelled "Specifications" with an h2 heading', () => {
    render(<Specifications specs={phoneSpecsFixtures} />)
    const region = screen.getByRole('region', { name: /specifications/i })
    expect(region).toBeInTheDocument()
    expect(
      within(region).getByRole('heading', { level: 2, name: 'Specifications' })
    ).toBeInTheDocument()
  })

  it('renders one row per spec entry with the expected labels', () => {
    render(<Specifications specs={phoneSpecsFixtures} />)
    const expectedLabels = [
      'Brand',
      'Name',
      'Description',
      'Screen',
      'Resolution',
      'Processor',
      'Main camera',
      'Selfie camera',
      'Battery',
      'OS',
      'Screen refresh rate',
    ]
    for (const label of expectedLabels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('term')).toHaveLength(expectedLabels.length)
  })

  it('renders the spec values in the same order as the labels', () => {
    const expected: Array<[string, string]> = [
      ['Brand', 'Apple'],
      ['Name', 'iPhone 15 Pro'],
      ['Description', 'A magical new way to interact with iPhone.'],
      ['Screen', '6.1" Super Retina XDR'],
      ['Resolution', '2556 x 1179'],
      ['Processor', 'Apple A17 Pro'],
      ['Main camera', '48 MP'],
      ['Selfie camera', '12 MP'],
      ['Battery', '3274 mAh'],
      ['OS', 'iOS 17'],
      ['Screen refresh rate', '120 Hz'],
    ]
    const { container } = render(<Specifications specs={phoneSpecsFixtures} />)
    const dts = Array.from(container.querySelectorAll('dt'))
    const dds = Array.from(container.querySelectorAll('dd'))
    expect(dts).toHaveLength(expected.length)
    expect(dds).toHaveLength(expected.length)
    expected.forEach(([label, value], index) => {
      expect(dts[index]).toHaveTextContent(label)
      expect(dds[index]).toHaveTextContent(value)
    })
  })

  it('uses a <dl> as the spec list wrapper', () => {
    const { container } = render(<Specifications specs={phoneSpecsFixtures} />)
    expect(container.querySelector('dl')).not.toBeNull()
  })

  it('marks the first row as the firstRow', () => {
    const { container } = render(<Specifications specs={phoneSpecsFixtures} />)
    const rows = container.querySelectorAll('dl > div')
    expect(rows.length).toBeGreaterThan(0)
    const firstRow = rows[0]
    const secondRow = rows[1]
    expect(firstRow?.className).toMatch(/firstRow/)
    expect(secondRow?.className).not.toMatch(/firstRow/)
  })
})
