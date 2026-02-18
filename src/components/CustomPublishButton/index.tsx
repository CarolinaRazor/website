import React from 'react'
import {PublishButton} from '@payloadcms/ui'
import type {PublishButtonServerProps} from 'payload'
import {checkRole} from "@/collections/Users/access/checkRole";
import {User} from "@/payload-types";

export default function CustomPublishButton(props: PublishButtonServerProps) {
  if (checkRole(['admin','sauthor','seditor'], props.user as User)) {
    return <PublishButton label="Publish Article" />
  }
  else {
    return (
      <button
        type="button"
        disabled
        className="btn btn--style-secondary btn--icon-style-without-border btn--size-medium btn--disabled"
        title="Contact an admin, senior author, or senior editor to publish this article"
      >
        Publish Article (Contact Admin)
      </button>
    )
  }
}
