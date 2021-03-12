import React, { useState } from 'react';

interface PostFormValues {
  title: string
  link: string
}

export function PostForm() {
  return (
    <div>
      <form>
        <input type="text" />
        <input type="text" />
        <button>+</button>
      </form>
    </div>
  )
}
