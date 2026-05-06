# Makinda Themes — WezTerm

## Install

Drop `makinda.lua` somewhere on Lua's `package.path`, e.g.
`~/.config/wezterm/colors/makinda.lua`, then in `~/.config/wezterm/wezterm.lua`:

```lua
local wezterm = require('wezterm')
local makinda = require('colors.makinda')

return {
    color_schemes = makinda,
    color_scheme = 'Makinda Dark', -- or 'Makinda Light'
}
```

## Source of truth

Generated from `source/palette.json`. Regenerate with `npm run build:wezterm`.
