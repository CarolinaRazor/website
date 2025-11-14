'use client'

import {useState} from 'react'
import RichText from "@/components/RichText"
import {DefaultTypedEditorState} from "@payloadcms/richtext-lexical"

interface Props {
  text: DefaultTypedEditorState
}

export default function BreakingHeader({ text }: Props) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      className="
        w-full
        bg-neutral-100
        dark:bg-neutral-900
        border-b border-neutral-300
        dark:border-neutral-700
        text-neutral-900
        dark:text-neutral-100
        py-3 px-4
        flex items-center justify-center
        relative
        transition-opacity duration-300
      "
    >
      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="
          absolute right-4 top-1/2 -translate-y-1/2
          text-neutral-500 dark:text-neutral-400
          hover:text-neutral-800 dark:hover:text-neutral-200
          transition
        "
        aria-label="Close announcement"
      >
        ×
      </button>

      {/* Centered text */}
      <div className="max-w-3xl text-center">
        <RichText
          className="
            font-serif
            prose dark:prose-invert
            max-w-none
            text-[1.05rem]
            leading-snug
            [&_p]:m-0
            [&_a]:underline
            [&_a]:decoration-neutral-400
            dark:[&_a]:decoration-neutral-500
          "
          data={text}
          enableGutter={false}
        />
      </div>
    </div>
  )
}
