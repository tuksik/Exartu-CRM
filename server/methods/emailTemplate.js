Meteor.methods({
  'createEmailTemplate': function (template) {
    return EmailTemplateManager.createTemplate(template);
  },
  'getPreview': function (text) {
    return EmailTemplateManager.getPreview(text);
  },
  'getTemplateInstance': function (templateId, entities) {
    return EmailTemplateManager.instantiateTemplate(templateId, entities);
  }
});