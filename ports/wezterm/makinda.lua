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
        foreground = "#1e2022",
        background = "#ffffff",
        cursor_bg = "#f05106",
        cursor_fg = "#ffffff",
        cursor_border = "#f05106",
        selection_bg = "#f3f3f5",
        selection_fg = "#1e2022",
        scrollbar_thumb = "#d1d5db",
        split = "#e7e8ea",
        ansi   = { "#36393f", "#dc2626", "#16a34a", "#d97706", "#2563eb", "#7c3aed", "#06b6d4", "#e5e7eb" },
        brights = { "#6b7280", "#f87171", "#22c55e", "#fbbf24", "#60a5fa", "#a855f7", "#22d3ee", "#ffffff" },
        indexed = {},
        compose_cursor = "#c73b07",
        tab_bar = {
            background = "#ffffff",
            active_tab = {
                bg_color = "#ffffff",
                fg_color = "#1e2022",
                intensity = "Bold",
            },
            inactive_tab = {
                bg_color = "#f9f9fa",
                fg_color = "#474b54",
            },
            inactive_tab_hover = {
                bg_color = "#f3f3f5",
                fg_color = "#1e2022",
            },
            new_tab = {
                bg_color = "#ffffff",
                fg_color = "#474b54",
            },
            new_tab_hover = {
                bg_color = "#f9f9fa",
                fg_color = "#1e2022",
            },
        },
    },
    ["Makinda Dark"] = {
        foreground = "#e7e8ea",
        background = "#0e0e0f",
        cursor_bg = "#ff6b0d",
        cursor_fg = "#0e0e0f",
        cursor_border = "#ff6b0d",
        selection_bg = "#1e2022",
        selection_fg = "#e7e8ea",
        scrollbar_thumb = "#36393f",
        split = "#1e2022",
        ansi   = { "#0e0e0f", "#f87171", "#34d399", "#fbbf24", "#60a5fa", "#a78bfa", "#2dd4bf", "#e6e6e8" },
        brights = { "#6b7280", "#fca5a5", "#86efac", "#fde68a", "#93c5fd", "#c4b5fd", "#67e8f9", "#ffffff" },
        indexed = {},
        compose_cursor = "#ff8d37",
        tab_bar = {
            background = "#0e0e0f",
            active_tab = {
                bg_color = "#0e0e0f",
                fg_color = "#e7e8ea",
                intensity = "Bold",
            },
            inactive_tab = {
                bg_color = "#161618",
                fg_color = "#969ba6",
            },
            inactive_tab_hover = {
                bg_color = "#1e2022",
                fg_color = "#e7e8ea",
            },
            new_tab = {
                bg_color = "#0e0e0f",
                fg_color = "#969ba6",
            },
            new_tab_hover = {
                bg_color = "#161618",
                fg_color = "#e7e8ea",
            },
        },
    },
}
