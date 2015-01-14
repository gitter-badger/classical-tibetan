---
layout: default
title: Blog
---
<div class="blog-header">
  <h1 class="blog-title">Miscellaneous Materials <small>For the Curious</small></h1>
  <p class="lead blog-description">Random collection of materials &amp; musings.</p>
</div>

<div class="list-group">
  {% for post in site.posts %}
    <a href="{{ post.url }}" class="list-group-item">
      <h4 class="list-group-item-heading">{{ post.title }}</h4>
      <p class="list-group-item-text">{{ post.excerpt }}</p>
    </a>
  {% endfor %}
</div>