import type { GetProps } from 'antd'
import Icon from '@ant-design/icons'

type CustomIconComponentProps = GetProps<typeof Icon>

function TagAdd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M6.5 5A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m0 0A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m14.91 6.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l.41.4a5.6 5.6 0 0 1 2.08-.74L4 11V4h7l9 9l-7 7l-1.08-1.08a5.6 5.6 0 0 1-.74 2.08l.41.41A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M6.5 5A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5M10 19H7v3H5v-3H2v-2h3v-3h2v3h3Z"
      />
    </svg>
  )
}

function TagRemove() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M6.5 5A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m0 0A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m14.91 6.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l.41.4a5.6 5.6 0 0 1 2.08-.74L4 11V4h7l9 9l-7 7l-1.08-1.08a5.6 5.6 0 0 1-.74 2.08l.41.41A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M6.5 5A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m1.62 16.54L6 19.41l-2.12 2.13l-1.42-1.42L4.59 18l-2.13-2.12l1.42-1.42L6 16.59l2.12-2.13l1.42 1.42L7.41 18l2.13 2.12Z"
      />
    </svg>
  )
}

function TagRemoveAll() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M6.5 5A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m0 0A1.5 1.5 0 1 0 8 6.5A1.5 1.5 0 0 0 6.5 5m11.83 3.5l4.59-4.58L21.5 2.5l-19 19l1.42 1.42l4.58-4.59l3.09 3.09A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M13 20l-3.08-3.08l7-7L20 13M5.61 15.43L7 14l-3-3V4h7l3.06 3.06l1.41-1.4l-3.06-3.08A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42M5 6.5A1.5 1.5 0 1 0 6.5 5A1.5 1.5 0 0 0 5 6.5"
      />
    </svg>
  )
}

function Delete() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="m20.37 8.91l-1 1.73l-12.13-7l1-1.73l3.04 1.75l1.36-.37l4.33 2.5l.37 1.37zM6 19V7h5.07L18 11v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2m2 0h8v-6.8L10.46 9H8z"
      />
    </svg>
  )
}

function InsertPhoto() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="m8.5 13.5l2.5 3l3.5-4.5l4.5 6H5m16 1V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"
      />
    </svg>
  )
}

function PhotoAlbum() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="m6 19l3-3.86l2.14 2.58l3-3.86L18 19zM6 4h5v8l-2.5-1.5L6 12M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2"
      />
    </svg>
  )
}

function NoteEdit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M21 10V9l-6-6H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h6v-1.87l8.39-8.39c.44-.44 1-.68 1.61-.74m-7-5.5l5.5 5.5H14zm8.85 9.69l-.98.98l-2.04-2.04l.98-.98c.19-.2.52-.2.72 0l1.32 1.32c.2.2.2.53 0 .72m-3.72-.36l2.04 2.04L15.04 22H13v-2.04z"
      />
    </svg>
  )
}

function CircleCheckBox() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24" color="#52c41a">
      <path
        d="M20 12a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8c.76 0 1.5.11 2.2.31l1.57-1.57A9.8 9.8 0 0 0 12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10M7.91 10.08L6.5 11.5L11 16L21 6l-1.41-1.42L11 13.17z"
      />
    </svg>
  )
}

function Warning() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
    </svg>
  )
}

function Pencil() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
      />
    </svg>
  )
}

export function TagAddIcon(props: CustomIconComponentProps) {
  return <Icon component={TagAdd} {...props} />
}

export function TagRemoveIcon(props: CustomIconComponentProps) {
  return <Icon component={TagRemove} {...props} />
}

export function DeleteIcon(props: CustomIconComponentProps) {
  return <Icon component={Delete} {...props} />
}

export function InsertPhotoIcon(props: CustomIconComponentProps) {
  return <Icon component={InsertPhoto} {...props} />
}

export function PhotoAlbumIcon(props: CustomIconComponentProps) {
  return <Icon component={PhotoAlbum} {...props} />
}

export function NoteEditIcon(props: CustomIconComponentProps) {
  return <Icon component={NoteEdit} {...props} />
}

export function TagRemoveAllIcon(props: CustomIconComponentProps) {
  return <Icon component={TagRemoveAll} {...props} />
}

export function CircleCheckBoxIcon(props: CustomIconComponentProps) {
  return <Icon component={CircleCheckBox} {...props} />
}

export function WarningIcon(props: CustomIconComponentProps) {
  return <Icon component={Warning} {...props} />
}

export function PencilIcon(props: CustomIconComponentProps) {
  return <Icon component={Pencil} {...props} />
}
