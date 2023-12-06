<script lang="ts">
	import FamilyTree from "$lib/components/FamilyTree.svelte";

  interface FamilyNode {
    name: string;
    children?: FamilyNode[];
    x?: number;
    y?: number;
  }

  let familyData: FamilyNode = {
    name: 'NPC',
    children: [
      {
        name: 'Anak 1',
        children: [
          { name: 'Lorem ipsum dolor sit amet' },
          { name: 'Lorem ipsum dolor sit amet uwewe osas' }
        ]
      },
      {
        name: 'Anak 2',
        children: [
          {
            name: 'Cucu 3',
            children: [{ name: 'Cicit 1' }, { name: 'Cicit 2' }]
          },
          {
            name: 'Cucu 4',
            children: [
              { name: 'Cicit 3' },
              {
                name: 'Cicit 4',
                children: [
                  {
                    name: 'Anton',
                    children: [
                      {
                        name: 'Adhit',
                        children: [
                          {
                            name: 'Heyho'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'Anak 3'
      }
    ]
  };
</script>

<FamilyTree {familyData} />