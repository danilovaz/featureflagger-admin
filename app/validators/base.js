import EmberObject from 'ember-object';

export default EmberObject.extend({
  properties: [],
  passed: false,

  check(model, prop) {
    this.set('passed', true);

    if (prop && this[prop]) {
      this[prop](model);
    } else {
      this.get('properties').forEach((property) => {
        if (this[property]) {
          this[property](model);
        }
      });
    }
    return this.get('passed');
  },

  invalidate() {
    this.set('passed', false);
  }
});
