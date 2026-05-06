-- Makinda Themes — WezTerm color schemes.
-- Generated from source/palette.json. Do not edit by hand.
--
-- Usage:
--   local wez = require('wezterm')
--   local makinda = require('makinda')   -- when this file is on package.path
--   return {
--       color_schemes = makinda,
--       color_scheme = 'Makinda Dark',
--   }
return {
    ["Makinda Light"] = {
        foreground = "#27272a",
        background = "#ffffff",
        cursor_bg = "#e65800",
        cursor_fg = "#ffffff",
        cursor_border = "#e65800",
        selection_bg = "#f4f4f5",
        selection_fg = "#27272a",
        scrollbar_thumb = "#d4d4d8",
        split = "#e4e4e7",
        ansi   = { "#52525b", "#e11d48", "#059669", "#d97706", "#2563eb", "#6b26c0", "#06b6d4", "#e4e4e7" },
        brights = { "#71717a", "#fb7185", "#10b981", "#fbbf24", "#60a5fa", "#a26ee2", "#22d3ee", "#ffffff" },
        indexed = {},
        compose_cursor = "#b34400",
        tab_bar = {
            background = "#ffffff",
            active_tab = {
                bg_color = "#ffffff",
                fg_color = "#27272a",
                intensity = "Bold",
            },
            inactive_tab = {
                bg_color = "#fafafa",
                fg_color = "#52525b",
            },
            inactive_tab_hover = {
                bg_color = "#f4f4f5",
                fg_color = "#27272a",
            },
            new_tab = {
                bg_color = "#ffffff",
                fg_color = "#52525b",
            },
            new_tab_hover = {
                bg_color = "#fafafa",
                fg_color = "#27272a",
            },
        },
    },
    ["Makinda Dark"] = {
        foreground = "#e4e4e7",
        background = "#0e0e0f",
        cursor_bg = "#ff711a",
        cursor_fg = "#0e0e0f",
        cursor_border = "#ff711a",
        selection_bg = "#27272a",
        selection_fg = "#e4e4e7",
        scrollbar_thumb = "#52525b",
        split = "#27272a",
        ansi   = { "#0e0e0f", "#fb7185", "#34d399", "#fbbf24", "#60a5fa", "#a26ee2", "#2dd4bf", "#e4e4e7" },
        brights = { "#71717a", "#fda4af", "#6ee7b7", "#fde68a", "#93c5fd", "#c1a5e4", "#67e8f9", "#ffffff" },
        indexed = {},
        compose_cursor = "#ff9452",
        tab_bar = {
            background = "#0e0e0f",
            active_tab = {
                bg_color = "#0e0e0f",
                fg_color = "#e4e4e7",
                intensity = "Bold",
            },
            inactive_tab = {
                bg_color = "#18181b",
                fg_color = "#a1a1aa",
            },
            inactive_tab_hover = {
                bg_color = "#27272a",
                fg_color = "#e4e4e7",
            },
            new_tab = {
                bg_color = "#0e0e0f",
                fg_color = "#a1a1aa",
            },
            new_tab_hover = {
                bg_color = "#18181b",
                fg_color = "#e4e4e7",
            },
        },
    },
}
