---
applyTo: '**/*.md'
---

# ContentRenderer

> Takes your component from an AST to a wonderful template.

The `<ContentRenderer>` component renders a document coming from a query with [`queryCollection()`](/docs/utils/query-collection).

<note>

This component **only works** with `Markdown` files.

</note>

## Props

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Description
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        value
      </code>
    </td>
    
    <td>
      <code>
        {}
      </code>
    </td>
    
    <td>
      <code>
        ParsedContent
      </code>
    </td>
    
    <td>
      The document to render.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        tag
      </code>
    </td>
    
    <td>
      <code>
        'div'
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      The tag to use for the renderer element if it is used.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        excerpt
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      Whether to render the excerpt only without the rest of the content.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        components
      </code>
    </td>
    
    <td>
      <code>
        {}
      </code>
    </td>
    
    <td>
      <code>
        object
      </code>
    </td>
    
    <td>
      The map of custom components to use for rendering. This prop will pass to the markdown renderer and will not affect other file types.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        data
      </code>
    </td>
    
    <td>
      <code>
        {}
      </code>
    </td>
    
    <td>
      <code>
        object
      </code>
      
       (required)
    </td>
    
    <td>
      A map of variables to inject into the markdown content for later use in binding variables.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        prose
      </code>
    </td>
    
    <td>
      <code>
        undefined
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      Whether or not to render Prose components instead of HTML tags.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        class
      </code>
    </td>
    
    <td>
      <code>
        undefined
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
      
       or <code>
        object
      </code>
    </td>
    
    <td>
      Root tag to use for rendering.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        unwrap
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
      
       or <code>
        string
      </code>
    </td>
    
    <td>
      Tags to unwrap separated by spaces. Example: <code>
        'ul li'
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

## Example Usage

```vue [pages/[...slug].vue]
<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
```

## Handling Missing Pages

If the queried content is **missing**, you can display a **custom fallback message**.

```vue [pages/[...slug].vue]
<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})
</script>

<template>
  <template v-if="page">
    <ContentRenderer :value="page" />
  </template>
  <template v-else>
    <div class="empty-page">
      <h1>Page Not Found</h1>
      <p>Oops! The content you're looking for doesn't exist.</p>
      <NuxtLink to="/">Go back home</NuxtLink>
    </div>
  </template>
</template>
```

## Handling Empty Pages

If the queried content is **empty**, you can display a **custom fallback message**.
