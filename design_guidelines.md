{
  "brand": {
    "name": "CHESS",
    "tagline": "Stop guessing. Start playing like you know what you're doing.",
    "attributes": [
      "premium",
      "competitive",
      "minimal-but-not-boring",
      "Gen-Z energy (controlled)",
      "luxury chess room at night",
      "fast + tactile",
      "instructional clarity"
    ],
    "voice_and_microcopy": {
      "allowed_phrases_sparingly": [
        "Lock In ♟️",
        "Your Move.",
        "Cook the Position.",
        "Time to Grind.",
        "Big Brain Move.",
        "You Found It.",
        "Blunder Detected 💀",
        "Clean Move 🔥",
        "Checkmate. GG."
      ],
      "usage_rules": [
        "Use at most 1 microcopy phrase per screen above the fold.",
        "Prefer short, confident sentences. Avoid excessive slang.",
        "Never use emoji as icons; microcopy emoji is allowed only inside text strings (as provided)."
      ]
    }
  },

  "design_personality": {
    "style_fusion": [
      "Chessboard monochrome identity (graphic pattern + strict B/W)",
      "Gaming UI depth (layered surfaces, subtle glows, crisp borders)",
      "Learning app clarity (Duolingo-like progress + feedback loops, but monochrome)"
    ],
    "layout_principles": [
      "Bento grid for previews (Openings/Lessons/Tactics) with varied card sizes.",
      "Split-screen lesson player: board left, explanation right (stacks on mobile).",
      "High-contrast typography; avoid visual noise behind reading areas.",
      "Use ‘frame’ motifs: chessboard sits inside a premium bezel with subtle inner stroke."
    ]
  },

  "color_system": {
    "rules": {
      "monochrome_priority": [
        "Use neutrals for 95% of UI.",
        "Accent colors only for: primary CTA, progress/XP, correct/incorrect feedback, focus ring.",
        "No colorful gradients. If any gradient is used, it must be neutral (black/gray) and cover <20% viewport."
      ],
      "dark_mode_default": true,
      "contrast": [
        "Body text must meet WCAG AA on dark surfaces.",
        "Use opacity tiers for text rather than many colors."
      ]
    },

    "tokens_hsl_css_variables": {
      "note": "These map to shadcn-style CSS variables in /src/index.css. Dark mode is default on first load by applying .dark on html/body.",
      "dark": {
        "--background": "0 0% 5%",
        "--foreground": "0 0% 96%",

        "--card": "0 0% 7%",
        "--card-foreground": "0 0% 96%",

        "--popover": "0 0% 7%",
        "--popover-foreground": "0 0% 96%",

        "--primary": "0 0% 96%",
        "--primary-foreground": "0 0% 9%",

        "--secondary": "0 0% 12%",
        "--secondary-foreground": "0 0% 96%",

        "--muted": "0 0% 12%",
        "--muted-foreground": "0 0% 70%",

        "--accent": "0 0% 14%",
        "--accent-foreground": "0 0% 96%",

        "--border": "0 0% 16%",
        "--input": "0 0% 16%",
        "--ring": "0 0% 92%",

        "--destructive": "0 72% 52%",
        "--destructive-foreground": "0 0% 98%",

        "--radius": "0.75rem",

        "--chart-1": "0 0% 92%",
        "--chart-2": "0 0% 72%",
        "--chart-3": "0 0% 52%",
        "--chart-4": "0 0% 32%",
        "--chart-5": "0 0% 18%",

        "--accent-action": "158 64% 52%",
        "--accent-action-foreground": "0 0% 8%",
        "--accent-warn": "38 92% 56%",
        "--accent-warn-foreground": "0 0% 10%"
      },
      "light": {
        "--background": "0 0% 98%",
        "--foreground": "0 0% 8%",

        "--card": "0 0% 100%",
        "--card-foreground": "0 0% 8%",

        "--popover": "0 0% 100%",
        "--popover-foreground": "0 0% 8%",

        "--primary": "0 0% 10%",
        "--primary-foreground": "0 0% 98%",

        "--secondary": "0 0% 95%",
        "--secondary-foreground": "0 0% 10%",

        "--muted": "0 0% 95%",
        "--muted-foreground": "0 0% 40%",

        "--accent": "0 0% 94%",
        "--accent-foreground": "0 0% 10%",

        "--border": "0 0% 88%",
        "--input": "0 0% 88%",
        "--ring": "0 0% 12%",

        "--destructive": "0 72% 52%",
        "--destructive-foreground": "0 0% 98%",

        "--radius": "0.75rem",

        "--chart-1": "0 0% 12%",
        "--chart-2": "0 0% 28%",
        "--chart-3": "0 0% 44%",
        "--chart-4": "0 0% 62%",
        "--chart-5": "0 0% 80%",

        "--accent-action": "158 64% 38%",
        "--accent-action-foreground": "0 0% 98%",
        "--accent-warn": "38 92% 44%",
        "--accent-warn-foreground": "0 0% 98%"
      }
    },

    "hex_reference": {
      "neutrals": {
        "bg_dark": "#0D0D0F",
        "bg_dark_2": "#111114",
        "surface": "#141418",
        "surface_2": "#191A1F",
        "border": "#2A2B33",
        "text": "#F2F2F3",
        "text_muted": "#B7B7BD"
      },
      "accents_small_use_only": {
        "action_mint": "#3EE6B2",
        "warn_amber": "#FFB020",
        "danger_red": "#E5484D"
      }
    }
  },

  "typography": {
    "google_fonts": {
      "display": {
        "family": "Space Grotesk",
        "weights": ["600", "700"],
        "usage": "Wordmark, hero headings, section titles"
      },
      "body": {
        "family": "IBM Plex Sans",
        "weights": ["400", "500", "600"],
        "usage": "Body, UI labels, lesson text"
      },
      "mono_optional": {
        "family": "Azeret Mono",
        "weights": ["500", "600"],
        "usage": "SAN move list, coordinates, small stats"
      }
    },
    "scale_tailwind": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
      "h2": "text-base md:text-lg font-medium text-muted-foreground",
      "section_title": "text-xl md:text-2xl font-semibold tracking-tight",
      "body": "text-sm md:text-base leading-relaxed",
      "small": "text-xs text-muted-foreground"
    },
    "micro_typography": {
      "caps_labels": "uppercase tracking-[0.18em] text-xs",
      "numbers": "tabular-nums",
      "move_list": "font-mono text-sm"
    }
  },

  "spacing_radius_shadow": {
    "spacing": {
      "page_padding": "px-4 sm:px-6 lg:px-10",
      "section_padding": "py-10 sm:py-14 lg:py-18",
      "card_padding": "p-4 sm:p-5",
      "stack_gap": "gap-3 sm:gap-4",
      "bento_gap": "gap-4 sm:gap-5"
    },
    "radius": {
      "card": "rounded-2xl",
      "button": "rounded-xl",
      "chip_badge": "rounded-full",
      "board_frame": "rounded-2xl"
    },
    "shadows": {
      "surface": "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
      "lift": "shadow-[0_14px_40px_rgba(0,0,0,0.45)]",
      "inner_stroke": "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
    },
    "borders": {
      "default": "border border-border/80",
      "hairline": "border border-border/60"
    }
  },

  "chessboard_design": {
    "board_frame_treatment": {
      "container_classes": "rounded-2xl bg-card/70 backdrop-blur-md border border-border/70 shadow-[0_18px_60px_rgba(0,0,0,0.55)]",
      "inner_bezel_classes": "rounded-[1.1rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
      "caption_row": "Use a thin top row for mode (Learn/Practice), move count, and flip/reset icons. Keep it minimal."
    },
    "react_chessboard_v5_styles": {
      "dark_mode": {
        "lightSquareStyle": {"backgroundColor": "#E7E7EA"},
        "darkSquareStyle": {"backgroundColor": "#2B2C33"},
        "coordinates": {"color": "rgba(242,242,243,0.65)"},
        "selectedSquare": "#3A3B45",
        "lastMoveHighlight": "rgba(62,230,178,0.22)",
        "legalMoveDot": "rgba(242,242,243,0.55)",
        "legalMoveCaptureRing": "rgba(62,230,178,0.55)",
        "checkHighlight": "rgba(229,72,77,0.22)",
        "correctTint": "rgba(62,230,178,0.18)",
        "incorrectTint": "rgba(229,72,77,0.16)",
        "hintTint": "rgba(255,176,32,0.16)"
      },
      "light_mode": {
        "lightSquareStyle": {"backgroundColor": "#F4F4F6"},
        "darkSquareStyle": {"backgroundColor": "#3A3B44"},
        "coordinates": {"color": "rgba(13,13,15,0.55)"},
        "selectedSquare": "#2B2C33",
        "lastMoveHighlight": "rgba(62,230,178,0.18)",
        "legalMoveDot": "rgba(13,13,15,0.35)",
        "legalMoveCaptureRing": "rgba(62,230,178,0.45)",
        "checkHighlight": "rgba(229,72,77,0.18)",
        "correctTint": "rgba(62,230,178,0.14)",
        "incorrectTint": "rgba(229,72,77,0.12)",
        "hintTint": "rgba(255,176,32,0.12)"
      },
      "squareStyles_guidance": {
        "legal_moves": "Use per-square styles to add a subtle dot (radial-gradient) for legal moves and a ring for captures. Keep monochrome dot; use mint ring only for captures.",
        "last_move": "Apply a soft mint tint overlay to from/to squares.",
        "selected": "Use a neutral darker overlay (no mint) so selection doesn’t look like success feedback.",
        "performance": "Prefer simple backgroundColor overlays; avoid heavy box-shadows per square."
      },
      "example_squareStyles_js": "const dot = (c) => ({ backgroundImage: `radial-gradient(circle at center, ${c} 0 18%, transparent 19%)` });\nconst ring = (c) => ({ backgroundImage: `radial-gradient(circle at center, transparent 0 58%, ${c} 59% 66%, transparent 67%)` });\n\n// squareStyles example\nconst squareStyles = {\n  [selectedSquare]: { backgroundColor: theme === 'dark' ? '#3A3B45' : '#2B2C33' },\n  [lastFrom]: { backgroundColor: theme === 'dark' ? 'rgba(62,230,178,0.22)' : 'rgba(62,230,178,0.18)' },\n  [lastTo]: { backgroundColor: theme === 'dark' ? 'rgba(62,230,178,0.22)' : 'rgba(62,230,178,0.18)' },\n  ...legalMoves.reduce((acc, sq) => ({ ...acc, [sq]: dot(theme === 'dark' ? 'rgba(242,242,243,0.55)' : 'rgba(13,13,15,0.35)') }), {}),\n  ...captureMoves.reduce((acc, sq) => ({ ...acc, [sq]: ring(theme === 'dark' ? 'rgba(62,230,178,0.55)' : 'rgba(62,230,178,0.45)') }), {}),\n};"
    },
    "pieces": {
      "direction": "Use premium, modern SVG piece set (flat + crisp). Avoid cartoon pieces.",
      "note": "If using react-chessboard default pieces, ensure high DPI and consistent contrast on both square colors."
    }
  },

  "homepage_chessboard_background": {
    "goal": "Large subtle chessboard pattern behind hero only (<=20% viewport height visually dominant), blurred/faded, not behind dense paragraphs.",
    "css_approach": {
      "classes": [
        "Create a hero wrapper with ::before for the checkerboard pattern.",
        "Use CSS gradients (no images) + mask/opacity + blur.",
        "Animate background-position slowly only when prefers-reduced-motion allows."
      ],
      "css_snippet": ".hero-checkerboard { position: relative; overflow: clip; }\n.hero-checkerboard::before {\n  content: '';\n  position: absolute;\n  inset: -20%;\n  background-color: #0D0D0F;\n  --tile: 84px;\n  background-image:\n    linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%),\n    linear-gradient(-45deg, rgba(255,255,255,0.06) 25%, transparent 25%),\n    linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.06) 75%),\n    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.06) 75%);\n  background-size: calc(var(--tile) * 2) calc(var(--tile) * 2);\n  background-position: 0 0, 0 var(--tile), var(--tile) calc(var(--tile) * -1), calc(var(--tile) * -1) 0;\n  filter: blur(10px);\n  opacity: 0.55;\n  transform: translateZ(0);\n  pointer-events: none;\n  mask-image: radial-gradient(60% 60% at 30% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);\n}\n@media (prefers-reduced-motion: no-preference) {\n  .hero-checkerboard::before {\n    animation: checker-drift 26s linear infinite;\n  }\n}\n@keyframes checker-drift {\n  from { background-position: 0 0, 0 var(--tile), var(--tile) calc(var(--tile) * -1), calc(var(--tile) * -1) 0; }\n  to { background-position: calc(var(--tile) * 2) calc(var(--tile) * 2), calc(var(--tile) * 2) calc(var(--tile) * 3), calc(var(--tile) * 3) var(--tile), var(--tile) calc(var(--tile) * 2); }\n}",
      "tailwind_usage": "Wrap hero section with className=\"hero-checkerboard\" and add a content overlay container with relative z-10."
    },
    "do_not": [
      "Do not place this pattern behind long lesson text.",
      "Do not increase opacity above 0.6.",
      "Do not use colorful gradients in the pattern."
    ]
  },

  "components": {
    "component_path": {
      "shadcn_primary": "/app/frontend/src/components/ui",
      "use_components": [
        {"name": "Button", "path": "button.jsx"},
        {"name": "Card", "path": "card.jsx"},
        {"name": "Badge", "path": "badge.jsx"},
        {"name": "Progress", "path": "progress.jsx"},
        {"name": "Tabs", "path": "tabs.jsx"},
        {"name": "Dialog", "path": "dialog.jsx"},
        {"name": "Sheet", "path": "sheet.jsx"},
        {"name": "Command", "path": "command.jsx"},
        {"name": "Input", "path": "input.jsx"},
        {"name": "Select", "path": "select.jsx"},
        {"name": "Tooltip", "path": "tooltip.jsx"},
        {"name": "Switch", "path": "switch.jsx"},
        {"name": "Carousel", "path": "carousel.jsx"},
        {"name": "ScrollArea", "path": "scroll-area.jsx"},
        {"name": "Skeleton", "path": "skeleton.jsx"},
        {"name": "Sonner Toast", "path": "sonner.jsx"},
        {"name": "Calendar", "path": "calendar.jsx"}
      ]
    },

    "navigation": {
      "sticky_top_nav": {
        "layout": "Left: wordmark CHESS. Center: nav links. Right: search + streak + profile + theme toggle.",
        "mobile": "Use Sheet (hamburger) with large tap targets and grouped sections.",
        "classes": "sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/70",
        "wordmark": "Space Grotesk 700, letterspacing tight; add subtle chess-square divider dot.",
        "data_testids": {
          "nav": "top-nav",
          "theme_toggle": "theme-toggle",
          "mobile_menu_button": "mobile-menu-button",
          "global_search_button": "global-search-button",
          "streak_indicator": "streak-indicator",
          "profile_button": "profile-button"
        }
      },
      "global_search": {
        "component": "Command",
        "trigger": "A compact search pill in nav; opens Command dialog.",
        "placeholder": "Search openings, tricks, or lessons...",
        "filters": "Use Tabs inside Command for All / Openings / Lessons / Tactics / Endgames.",
        "data_testids": {
          "search-input": "global-search-input",
          "search-result-item": "global-search-result-item"
        }
      }
    },

    "cards": {
      "opening_card": {
        "structure": [
          "Top row: Opening name + difficulty badge",
          "Middle: mini board preview (static) or piece silhouette",
          "Bottom: short description + recommended-for chips + CTA"
        ],
        "classes": "group rounded-2xl bg-card/70 border border-border/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)] transition-shadow",
        "hover": "On hover: border becomes slightly brighter + subtle glow on CTA only.",
        "data_testids": {
          "card": "opening-card",
          "cta": "opening-card-learn-button"
        }
      },
      "lesson_card": {
        "structure": [
          "Title + difficulty",
          "Meta row: time estimate + XP reward",
          "Progress bar",
          "Start/Continue button"
        ],
        "progress": "Use Progress component; fill uses accent-action (mint) at low saturation.",
        "data_testids": {
          "card": "lesson-card",
          "cta": "lesson-card-start-button",
          "progress": "lesson-card-progress"
        }
      },
      "achievement_badge": {
        "component": "Badge",
        "style": "Monochrome badge with subtle inner stroke; mint only for ‘earned’ state dot.",
        "data_testids": {
          "badge": "achievement-badge"
        }
      }
    },

    "buttons": {
      "variants": {
        "primary": {
          "intent": "Start Learning / Continue / Submit",
          "style": "Solid mint accent-action with dark text; minimal glow on hover.",
          "classes": "bg-[hsl(var(--accent-action))] text-[hsl(var(--accent-action-foreground))] hover:brightness-[1.03] focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-action))]",
          "motion": "transition-colors transition-shadow duration-200"
        },
        "secondary": {
          "intent": "Explore Openings / Practice Tactics",
          "style": "Neutral surface with border; hover lifts slightly.",
          "classes": "bg-secondary text-secondary-foreground border border-border/70 hover:bg-secondary/80",
          "motion": "transition-colors transition-shadow duration-200"
        },
        "ghost": {
          "intent": "Icon buttons (flip/reset/undo)",
          "style": "Transparent with subtle hover background.",
          "classes": "hover:bg-accent/60",
          "motion": "transition-colors duration-150"
        },
        "danger": {
          "intent": "Reset progress / Delete",
          "style": "Use destructive token; keep minimal.",
          "classes": "bg-destructive text-destructive-foreground hover:brightness-[1.03]",
          "motion": "transition-colors duration-200"
        }
      },
      "sizes": {
        "sm": "h-9 px-3 text-sm",
        "md": "h-10 px-4 text-sm",
        "lg": "h-11 px-5 text-base"
      },
      "data_testids": {
        "primary_cta": "primary-cta-button",
        "secondary_cta": "secondary-cta-button"
      }
    },

    "progress_xp_level": {
      "xp_bar": {
        "component": "Progress",
        "style": "Track: muted; Fill: mint. Add a tiny animated sheen only on level-up.",
        "data_testids": {
          "xp-bar": "xp-progress-bar",
          "level-label": "level-label",
          "streak": "streak-count"
        }
      },
      "streak_chip": {
        "component": "Badge",
        "style": "Neutral badge with amber dot (small use).",
        "data_testids": {
          "streak-chip": "streak-chip"
        }
      }
    },

    "lesson_player": {
      "layout": {
        "desktop": "grid grid-cols-12 gap-5; board col-span-7; panel col-span-5",
        "mobile": "flex flex-col gap-4; board first; panel second; sticky bottom controls"
      },
      "panel": {
        "component": "Card",
        "style": "Readable surface; no patterns behind text.",
        "data_testids": {
          "panel": "lesson-explanation-panel",
          "step-title": "lesson-step-title",
          "step-body": "lesson-step-body"
        }
      },
      "controls": {
        "components": ["Button", "Progress"],
        "buttons": ["Previous", "Next", "Restart"],
        "data_testids": {
          "prev": "lesson-prev-button",
          "next": "lesson-next-button",
          "restart": "lesson-restart-button",
          "progress": "lesson-progress"
        }
      },
      "your_turn_checkpoint": {
        "feedback": "Use mint for correct, red for incorrect, amber for hint. Keep overlays subtle.",
        "data_testids": {
          "checkpoint": "your-turn-checkpoint",
          "feedback": "your-turn-feedback"
        }
      }
    },

    "tactics_trainer": {
      "feedback_ui": {
        "component": "Alert",
        "states": {
          "correct": "border-mint tint background",
          "incorrect": "border-red tint background",
          "try_again": "neutral"
        },
        "data_testids": {
          "feedback": "tactics-feedback",
          "next": "tactics-next-button",
          "hint": "tactics-hint-button"
        }
      }
    },

    "auth": {
      "layout": "Centered card on dark background, but content inside left-aligned. Use subtle chessboard pattern only as a corner accent.",
      "components": ["Card", "Input", "Button", "Separator"],
      "google_button": "Secondary button with Google icon (lucide-react).",
      "data_testids": {
        "login_email": "login-email-input",
        "login_password": "login-password-input",
        "login_submit": "login-submit-button",
        "google": "login-google-button",
        "register_submit": "register-submit-button"
      }
    }
  },

  "layout_grid": {
    "container": "max-w-6xl mx-auto",
    "grid": {
      "bento": "grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5",
      "bento_cards": {
        "openings": "md:col-span-7",
        "lessons": "md:col-span-5",
        "tactics": "md:col-span-12"
      }
    },
    "responsive_rules": [
      "Mobile-first: stack everything; avoid side-by-side text blocks under 360px.",
      "Tap targets >= 44px.",
      "Use ScrollArea for horizontal card rows on mobile (Openings preview)."
    ]
  },

  "motion": {
    "library": "framer-motion",
    "principles": [
      "Subtle, fast, and purposeful. No bouncy overshoot.",
      "Prefer opacity + small translateY (6–10px).",
      "Avoid animating expensive properties on the chessboard itself."
    ],
    "durations_ms": {
      "hover": 150,
      "card_enter": 260,
      "page_transition": 220,
      "xp_gain": 450,
      "level_up": 700
    },
    "easing": {
      "standard": "[0.22, 1, 0.36, 1]",
      "snappy": "[0.2, 0.8, 0.2, 1]"
    },
    "recipes": {
      "card_reveal": "initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.26, ease: [0.22,1,0.36,1] }}",
      "xp_gain": "Animate Progress value + a tiny floating '+XP' label that fades up 8px.",
      "level_up": "Brief ring pulse around level badge (scale 1 -> 1.04 -> 1) + subtle sheen across XP bar."
    },
    "reduced_motion": "Respect prefers-reduced-motion: disable background drift and reduce motion distances to 0."
  },

  "charts_and_data_viz": {
    "library": "recharts",
    "usage": "Progress dashboard: streak over time, accuracy trend, lessons completed.",
    "style": {
      "grid": "Use hairline grid with border color at 20% opacity.",
      "lines": "Monochrome lines; mint highlight for current week only.",
      "tooltips": "Use shadcn Tooltip/Popover styling; keep compact."
    },
    "install": {
      "note": "If not installed: npm i recharts",
      "components": ["LineChart", "AreaChart", "ResponsiveContainer"]
    }
  },

  "accessibility": {
    "focus": "Always show focus-visible ring (ring token).",
    "keyboard": "Command search, lesson controls, and board controls must be keyboard reachable.",
    "contrast": "Avoid gray-on-gray for body text; use muted only for secondary metadata.",
    "aria": "Add aria-labels for icon-only buttons (flip, undo, reset).",
    "testing": "All interactive and key informational elements MUST include data-testid (kebab-case)."
  },

  "performance": {
    "board": [
      "Memoize squareStyles and only recompute when dependencies change.",
      "Avoid per-square box-shadow; use backgroundColor overlays.",
      "Keep animations off the board container during drag."
    ],
    "images": [
      "Prefer CSS patterns over large background images.",
      "If using Unsplash images, set width params and lazy-load below the fold."
    ]
  },

  "image_urls": {
    "hero_or_marketing": [
      {
        "category": "hero-side-visual",
        "description": "Monochrome chess pieces photo for marketing sections (optional; keep subtle, low opacity).",
        "url": "https://images.unsplash.com/photo-1588412079929-790b9f593d8e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwY2hlc3MlMjBwaWVjZXMlMjBtb25vY2hyb21lJTIwc3R1ZGlvJTIwcGhvdG9ncmFwaHl8ZW58MHx8fGJsYWNrfDE3ODc5MDQ0MzJ8MA&ixlib=rb-4.1.0&q=85"
      },
      {
        "category": "section-divider-texture",
        "description": "Abstract monochrome texture for subtle section backgrounds (use with opacity 0.15 max).",
        "url": "https://images.unsplash.com/photo-1637946175559-22c4fe13fc54?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxkYXJrJTIwbHV4dXJ5JTIwZ2FtaW5nJTIwZGFzaGJvYXJkJTIwYWJzdHJhY3QlMjBtb25vY2hyb21lJTIwdGV4dHVyZXxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3ODc5MDQ0Mzd8MA&ixlib=rb-4.1.0&q=85"
      }
    ],
    "puzzle_or_blog_thumbs": [
      {
        "category": "puzzle-thumb",
        "description": "Chessboard scene for puzzle thumbnails (crop square).",
        "url": "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2hlc3MlMjBwaWVjZXMlMjBtb25vY2hyb21lJTIwc3R1ZGlvJTIwcGhvdG9ncmFwaHl8ZW58MHx8fGJsYWNrfDE3ODc5MDQ0MzJ8MA&ixlib=rb-4.1.0&q=85"
      }
    ]
  },

  "instructions_to_main_agent": {
    "global_css_changes": [
      "Remove/ignore CRA default centering styles in App.css (do not use .App { text-align:center }).",
      "Set dark mode as default by adding class 'dark' to <html> on first load; persist theme in localStorage.",
      "Add the hero checkerboard CSS (above) to App.css or a dedicated global stylesheet; ensure it only affects hero.",
      "Add font imports in index.html (Google Fonts) and set font-family in index.css base layer."
    ],
    "tailwind_tokens": [
      "Update /src/index.css :root and .dark variables to match tokens_hsl_css_variables.",
      "Add custom CSS vars for --accent-action and --accent-warn (used in Tailwind arbitrary values)."
    ],
    "page_build_order": [
      "1) Top nav + theme toggle + Command search",
      "2) Home hero with board + chessboard background pattern",
      "3) Openings list + opening detail",
      "4) Lessons list + lesson player",
      "5) Tactics trainer + daily puzzle",
      "6) Progress dashboard + charts",
      "7) Auth screens (later phase)"
    ],
    "data_testid_policy": [
      "Add data-testid to: nav links, CTAs, search, filters, lesson controls, tactic feedback, progress stats, auth inputs/buttons.",
      "Use kebab-case describing role (not appearance)."
    ],
    "board_integration_notes": [
      "Do not change react-chessboard mechanics; only pass style props and squareStyles.",
      "Memoize computed styles; avoid re-render loops during drag.",
      "Keep board container stable size to prevent layout shift."
    ]
  }
}

---

<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
