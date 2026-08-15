import { test, expect } from '@playwright/test'
import { openSettings, setPomodoroMinutes, getPrimaryColor, parseTimer, addTask } from './helpers'

test.describe('Timer - navegación entre modos', () => {

  test('1 - Carga inicial muestra Pomodoro en 20:00', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('mode-tab-pomodoro')).toBeVisible()
    await expect(page.getByTestId('timer-display')).toHaveText('20:00')
  })

  test('2 - Cambiar a Short Break actualiza tiempo y color de tema', async ({ page }) => {
    await page.goto('/')
    const colorBefore = await getPrimaryColor(page)

    await page.getByTestId('mode-tab-shortBreak').click()

    await expect(page.getByTestId('timer-display')).toHaveText('05:00')
    const colorAfter = await getPrimaryColor(page)
    expect(colorAfter).not.toBe(colorBefore)
  })

  test('3 - Cambiar a Long Break actualiza tiempo y color de tema', async ({ page }) => {
    await page.goto('/')
    const colorBefore = await getPrimaryColor(page)

    await page.getByTestId('mode-tab-longBreak').click()

    await expect(page.getByTestId('timer-display')).toHaveText('10:00')
    const colorAfter = await getPrimaryColor(page)
    expect(colorAfter).not.toBe(colorBefore)
  })
})

test.describe('Timer - conteo real', () => {

  test('4 - Start realmente decrementa el tiempo (sin esperar el ciclo completo)', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByTestId('timer-display')).toHaveText('20:00')
    const initialText = await page.getByTestId('timer-display').innerText()
    const initial = parseTimer(initialText)

    await page.getByTestId('start-pause-btn').click()
    await expect(page.getByTestId('start-pause-btn')).toHaveText('PAUSAR')

    await page.waitForTimeout(3000)

    const afterText = await page.getByTestId('timer-display').innerText()
    const after = parseTimer(afterText)

    const initialTotalSeconds = initial.minutes * 60 + initial.seconds
    const afterTotalSeconds = after.minutes * 60 + after.seconds

    expect(afterTotalSeconds).toBeLessThan(initialTotalSeconds)

    await page.getByTestId('start-pause-btn').click()
    await expect(page.getByTestId('start-pause-btn')).toHaveText('INICIAR')
  })
})

test.describe('Tareas - flujo CRUD completo', () => {

  const TASK_NAME = 'Tarea E2E Playwright'
  const TASK_EDITED = 'Tarea E2E Editada'

  test('5 - Agregar, editar, tachar y borrar una tarea (flujo único)', async ({ page }) => {
    await page.goto('/')

    await addTask(page, TASK_NAME)
    const taskItem = page.locator('[data-testid^="task-item-"]').filter({ hasText: TASK_NAME })
    await expect(taskItem).toBeVisible()

    await taskItem.getByTestId('task-name').dblclick()
    const editInput = page.getByTestId('task-edit-input')
    await editInput.fill(TASK_EDITED)
    await editInput.press('Enter')

    const editedItem = page.locator('[data-testid^="task-item-"]').filter({ hasText: TASK_EDITED })
    await expect(editedItem).toBeVisible()

    await editedItem.getByTestId('task-toggle-btn').click()
    await expect(editedItem.getByTestId('task-name')).toHaveClass(/line-through/)

    await editedItem.hover()
    await editedItem.getByTestId('task-delete-btn').click()
    await expect(page.locator('[data-testid^="task-item-"]').filter({ hasText: TASK_EDITED })).not.toBeVisible()
  })

  test('6 - Reordenar tareas con drag and drop', async ({ page }) => {
    await page.goto('/')

    await addTask(page, 'Tarea A')
    await addTask(page, 'Tarea B')

    const taskA = page.locator('[data-testid^="task-item-"]').filter({ hasText: 'Tarea A' })
    const taskB = page.locator('[data-testid^="task-item-"]').filter({ hasText: 'Tarea B' })

    const namesBefore = await page.getByTestId('task-name').allInnerTexts()
    expect(namesBefore.indexOf('Tarea A')).toBeLessThan(namesBefore.indexOf('Tarea B'))

    const handleA = taskA.getByTestId('task-drag-handle')
    const handleBox = await handleA.boundingBox()
    const targetBox = await taskB.boundingBox()

    if (!handleBox || !targetBox) {
      throw new Error('No se pudo obtener la posición de los elementos a arrastrar')
    }

    const startX = handleBox.x + handleBox.width / 2
    const startY = handleBox.y + handleBox.height / 2
    const endX = targetBox.x + targetBox.width / 2
    const endY = targetBox.y + targetBox.height + 10

    await page.mouse.move(startX, startY)
    await page.mouse.down()

    await page.mouse.move(startX, startY + 10, { steps: 5 })
    await page.waitForTimeout(150)

    const midY = (startY + endY) / 2
    await page.mouse.move(startX, midY, { steps: 15 })
    await page.waitForTimeout(150)
    await page.mouse.move(endX, endY, { steps: 15 })
    await page.waitForTimeout(150)

    await page.mouse.up()
    await page.waitForTimeout(300)

    await expect(async () => {
      const namesAfter = await page.getByTestId('task-name').allInnerTexts()
      expect(namesAfter.indexOf('Tarea B')).toBeLessThan(namesAfter.indexOf('Tarea A'))
    }).toPass({ timeout: 5000 })

    await taskA.hover()
    await taskA.getByTestId('task-delete-btn').click()
    await taskB.hover()
    await taskB.getByTestId('task-delete-btn').click()
  })
})

test.describe('Persistencia en localStorage', () => {

  test('7 - Las tareas sobreviven un reload', async ({ page }) => {
    await page.goto('/')

    await addTask(page, 'Tarea Persistente')
    await expect(page.getByTestId('task-name').filter({ hasText: 'Tarea Persistente' })).toBeVisible()

    await page.reload()

    await expect(page.getByTestId('task-name').filter({ hasText: 'Tarea Persistente' })).toBeVisible()

    const taskItem = page.locator('[data-testid^="task-item-"]').filter({ hasText: 'Tarea Persistente' })
    await taskItem.hover()
    await taskItem.getByTestId('task-delete-btn').click()
  })
})

test.describe('Settings - validación y aplicación real', () => {

  test('8 - Solo acepta enteros: 0.1 se guarda como 1', async ({ page }) => {
    await page.goto('/')
    await setPomodoroMinutes(page, '0.1')

    await page.getByTestId('mode-tab-shortBreak').click()
    await page.getByTestId('mode-tab-pomodoro').click()

    await expect(page.getByTestId('timer-display')).toHaveText('01:00')

    await setPomodoroMinutes(page, '20')
  })

  test('9 - Cambiar minutos de Pomodoro afecta el timer real', async ({ page }) => {
    await page.goto('/')
    await setPomodoroMinutes(page, '15')

    await page.getByTestId('mode-tab-shortBreak').click()
    await page.getByTestId('mode-tab-pomodoro').click()

    await expect(page.getByTestId('timer-display')).toHaveText('15:00')

    await setPomodoroMinutes(page, '20')
  })

  test('10 - Cancel no guarda cambios', async ({ page }) => {
    await page.goto('/')
    await openSettings(page)

    await page.getByTestId('settings-pomodoro-input').fill('99')
    await page.getByTestId('settings-cancel-btn').click()

    await expect(page.getByTestId('settings-modal')).not.toBeVisible()

    await openSettings(page)
    await expect(page.getByTestId('settings-pomodoro-input')).toHaveValue('20')
    await page.getByTestId('settings-cancel-btn').click()
  })
})

test.describe('Modal About', () => {

  test('11 - Abre y cierra correctamente', async ({ page }) => {
    await page.goto('/')

    await page.getByTestId('open-about-btn').click()
    await expect(page.getByTestId('about-modal')).toBeVisible()
    await expect(page.getByTestId('about-app-name')).toHaveText('Light Pomodoro')

    await page.getByTestId('about-footer-close-btn').click()
    await expect(page.getByTestId('about-modal')).not.toBeVisible()
  })
})