import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Rectangle,
} from 'electron'
import Store from 'electron-store'

export const createWindow = (
  windowName: string,
  options: BrowserWindowConstructorOptions
): BrowserWindow => {
  const key = 'window-state'
  const name = `window-state-${windowName}`
  const store = new Store<Rectangle>({ name })
  const defaultSize = {
    width: options.width,
    height: options.height,
  }
  let state = {}
  let isFullScreen = false // Track fullscreen state

  const restore = () => store.get(key, defaultSize)

  const getCurrentPosition = () => {
    const position = win.getPosition()
    const size = win.getSize()
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    }
  }

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    )
  }

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    })
  }

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds)
    })
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults()
    }
    return windowState
  }

  const saveState = () => {
    // Only save state when not in fullscreen and not minimized/maximized
    if (!win.isMinimized() && !win.isMaximized() && !win.isFullScreen()) {
      Object.assign(state, getCurrentPosition())
    }
    store.set(key, state)
  }

  state = ensureVisibleOnSomeDisplay(restore())

  const win = new BrowserWindow({
    ...state,
    ...options,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      ...options.webPreferences,
    },
  })

  // Remove or modify F11 prevention if you want to allow fullscreen toggle
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      // Allow F11 to work for fullscreen toggle
      isFullScreen = !isFullScreen
      win.setFullScreen(isFullScreen)
      event.preventDefault() // Prevent default browser behavior
    }
  })

  // Remove the problematic maximize handler that prevents fullscreen
  // win.on('maximize', () => {
  //   win.unmaximize()
  // })

  // Optional: Add proper fullscreen event handlers
  win.on('enter-full-screen', () => {
    isFullScreen = true
  })

  win.on('leave-full-screen', () => {
    isFullScreen = false
  })

  win.setMenuBarVisibility(false)
  win.on('close', saveState)

  return win
}