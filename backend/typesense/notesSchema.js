export default {
  name: 'notes',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string', facet: false },
    { name: 'content', type: 'string', facet: false },
    { name: 'color', type: 'string', facet: true },
    { name: 'tag', type: 'string', facet: true },
    { name: 'position_x', type: 'float', facet: false },
    { name: 'position_y', type: 'float', facet: false },
    { name: 'createdAt', type: 'int64', facet: false },
    { name: 'updatedAt', type: 'int64', facet: false },
  ],
  default_sorting_field: 'createdAt',
};