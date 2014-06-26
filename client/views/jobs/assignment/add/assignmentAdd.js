var assignment=null;
var employeeId=null;
var jobId=null
var assignmentDependency=new Deps.Dependency;
var employeeDependency=new Deps.Dependency;
Template.assignmentAdd.created=function(){
  assignment=null;
}

var init=function(options){
  var options=options || {};
  if (options.assignmentId){
    var assignment= Assignments.findOne({_id: assignment});
    return {
      start: assignment.start,
      end: assignment.end,
      rates: assignment.rates
    }
  }else{
    var employeeParameter= options.employeeId;
    if(employeeParameter){
      employeeId= employeeParameter;
      employeeDependency.changed()
    }

    jobId= options.jobId || Session.get('entityId');
    var job=Jobs.findOne({
        _id: jobId
      });

    return assignment= {
        start: job.startDate,
        end: job.endDate,
        rates: job.jobRates
      };
  }
}
Template.assignmentAdd.helpers({
  assignment:function(){
    var params=this[0];
    if(!assignment){
      assignment= init(params)
    }
    console.dir(assignment);
    assignmentDependency.depend();
    return assignment;
  },
  employees:function(){
    return Contactables.find({
      Employee: {
        $exists: true
      }
    });
  },
  getType: function(typeId){
    return  JobRateTypes.findOne({ _id: typeId });
  },
  isSelected: function(id){
    employeeDependency.depend();
    return employeeId==id;
  },
  getJobStart: function(){
    var job=Jobs.findOne({
      _id: jobId
    });
    return job.startDate;
  },
  getJobEnd: function(){
    var job=Jobs.findOne({
      _id: jobId
    });
    return job.endDate;
  }
})

Template.assignmentAdd.events({
  'change .employeeSelect':function(e, ctx){
    employeeId= e.target.value;
  },
  'click .save':function(e, ctx){
    if (!employeeId){

      return;
    }

    assignment.job= Session.get('entityId');
    assignment.employee= employeeId;
    Assignments.insert(assignment,function(err, result){
      if(err){
        console.log(err)
      }else{
        $('.modal-host').children().modal('toggle')
      }
    });
  },

  'change .hasEnded': function(e){
    if(e.target.checked){
      assignment.end=new Date;
    }else{
      assignment.end=null;
    }
    assignmentDependency.changed();
  },
  'change.dp .startDate > .dateTimePicker': function(e, ctx) {
    if ($(e.target).hasClass('dateTimePicker')){
      assignment.start = $(e.target).data('DateTimePicker').date.toDate();
    }
  },
  'change.dp .endDate > .dateTimePicker': function(e, ctx) {
    if ($(e.target).hasClass('dateTimePicker')){
      assignment.end = $(e.target).data('DateTimePicker').date.toDate();
    }
  }
});



