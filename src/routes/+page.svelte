<script lang="ts">
import type { PageData } from './$types';

export let data: PageData;
</script>

<h1>Test Scene: {data.scene.id}</h1>
<pre>{JSON.stringify(data.scene, null, 2)}</pre>
