import { Page, expect } from '@playwright/test'

export async function openSettings(page: Page) {
  await page.getByTestId('open-settings-btn').click()
  await expect(page.getByTestId('settings-modal')).toBeVisible()
}

export async function setPomodoroMinutes(page: Page, minutes: string) {
  await openSettings(page)
  await page.getByTestId('settings-pomodoro-input').fill(minutes)
  await page.getByTestId('settings-save-btn').click()
  await expect(page.getByTestId('settings-modal')).not.toBeVisible()
}

export async function getPrimaryColor(page: Page): Promise<string> {
  return page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-gv-primary-dark').trim()
  )
}

export function parseTimer(text: string): { minutes: number; seconds: number } {
  const [m, s] = text.split(':').map(Number)
  return { minutes: m, seconds: s }
}

export async function addTask(page: Page, name: string) {
  const addBtn = page.getByTestId('add-task-btn')
  const input = page.getByTestId('new-task-input')

  if (!(await input.isVisible())) {
    await addBtn.click()
  }

  await input.fill(name)
  await input.press('Enter')
  await expect(input).not.toBeVisible()
}