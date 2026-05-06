-- Generated. Do not edit.
local M = {}

local config = {
    variant = "auto",      -- "light" | "dark" | "auto"
    transparent = false,
    italic_comments = true,
    italic_keywords = false,
    terminal_colors = true,
}

function M.setup(opts)
    config = vim.tbl_deep_extend("force", config, opts or {})
end

local function resolve_variant()
    if config.variant == "auto" then
        return (vim.o.background == "light") and "light" or "dark"
    end
    return config.variant
end

function M.load(variant)
    variant = variant or resolve_variant()

    if vim.g.colors_name then vim.cmd("hi clear") end
    if vim.fn.exists("syntax_on") == 1 then vim.cmd("syntax reset") end
    vim.o.termguicolors = true
    vim.o.background = variant
    vim.g.colors_name = "makinda-" .. variant

    local palette = require("makinda.palette")[variant]
    if not palette then
        error("makinda: unknown variant: " .. tostring(variant))
    end

    local p = vim.deepcopy(palette)
    if config.transparent then
        p.bg = "NONE"
        p.bg_sidebar = "NONE"
        p.bg_panel = "NONE"
    end

    local hi = require("makinda.highlights").get(p)

    if not config.italic_comments then
        for _, name in ipairs({ "Comment", "@comment", "@comment.documentation", "SpecialComment" }) do
            if hi[name] then hi[name].italic = false end
        end
    end
    if config.italic_keywords then
        for _, name in ipairs({ "Keyword", "Statement", "@keyword" }) do
            if hi[name] then hi[name].italic = true end
        end
    end

    for name, opts in pairs(hi) do
        vim.api.nvim_set_hl(0, name, opts)
    end

    if config.terminal_colors then
        vim.g.terminal_color_0  = p.ansi_black
        vim.g.terminal_color_1  = p.ansi_red
        vim.g.terminal_color_2  = p.ansi_green
        vim.g.terminal_color_3  = p.ansi_yellow
        vim.g.terminal_color_4  = p.ansi_blue
        vim.g.terminal_color_5  = p.ansi_magenta
        vim.g.terminal_color_6  = p.ansi_cyan
        vim.g.terminal_color_7  = p.ansi_white
        vim.g.terminal_color_8  = p.ansi_bright_black
        vim.g.terminal_color_9  = p.ansi_bright_red
        vim.g.terminal_color_10 = p.ansi_bright_green
        vim.g.terminal_color_11 = p.ansi_bright_yellow
        vim.g.terminal_color_12 = p.ansi_bright_blue
        vim.g.terminal_color_13 = p.ansi_bright_magenta
        vim.g.terminal_color_14 = p.ansi_bright_cyan
        vim.g.terminal_color_15 = p.ansi_bright_white
    end
end

return M
