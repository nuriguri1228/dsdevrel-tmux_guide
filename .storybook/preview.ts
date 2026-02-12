import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          "Introduction",
          "1부: Linux tmux 가이드",
          "2부: Claude Code Agent Team",
        ],
      },
    },
  },
};

export default preview;
