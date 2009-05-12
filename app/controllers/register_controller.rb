class RegisterController < ApplicationController
  before_filter :login_required
  
  def global_submenu
    [ { :name => "<img src=\"/images/icons/help.png\" class=\"icon\" /> Registration Help", :render => "help" } ]
  end
  
  
  def index
    @section_title = "Registrations"
    
    @submenu = global_submenu
    
    
    @sessions = Session.find(:all, :conditions => {:is_active => true})
  end
  
  def for
    name = params[:id].gsub(/-/, ' ')
    
    @current_session = Session.find(:first, :conditions => { :name => name })
    
    @section_path = "Registrations &raquo; "
    @section_title = @current_session.name
    
    @submenu = global_submenu
    
    @students = current_user.students
    
    @registration_options = @current_session.registration_options
    
    @schools = School.find(:all)
    
    
    
    if @current_session.registration_type == Session::DATE_TYPE
      @dates = @current_session.session_days.sort {|a,b| a.date <=> b.date} #make sure it's sorted, else doesn't work!
                                                                            # also this should NOT be empty

      #add buffer dates front and end so we start on sunday and end on saturday
      until @dates[0].date.wday() == 1
        @dates.insert(0, @dates[0] - 1)
      end
      until @dates[-1].date.wday() == 6
        @dates.push(@dates[-1] + 1)
      end
    else
      
      #yeah.. do something for day type registration
    end
    
  end
  
  def save
    
    current_session = Session.find(params[:session_id])
    
    
    #first deal with the student
    if params[:student_id].to_i == 0
      student = current_user.students.new
    else
      student = Student.find(params[:student_id])
    end
    
    student.first_name = params[:first_name]
    student.middle_initial = params[:mi]
    student.last_name = params[:last_name]
    student.dob = Date.parse(params[:student]["dob(1i)"] + "/" + params[:student]["dob(2i)"] + "/" + params[:student]["dob(3i)"])
    student.school = params[:student_school]
    student.grade_level = params[:grade]
    student.comment = params[:comment]
    student.save
    
    
    #now register him!
    #first plain registration
    registration = Registration.find(:first, :conditions => {:student_id => student.id, :session_id => current_session.id})
    unless registration
      registration = student.registrations.new
      registration.session_id = current_session.id
    end
    registration.school_id = params[:school]
    registration.lesson_duration = params[:duration]
    
    registration.save
    
    #secondly the options
    registration.registered_options.each {|opt| opt.destroy }
    params[:reg_option].each do |id, value|
      option = registration.registered_options.new
      option.option_id = id
      option.value = value
      
      option.save
    end
    
    #3rd, registered dates
    registration.registered_dates.each {|date| date.destroy}
    params[:times].each do |date, times|
      times.split(/[,\s]+/).each do |time_str|
        tr = TimeRange.new(time_str)
        
        reg_date = registration.registered_dates.new
        reg_date.user_input = time_str
        reg_date.start = (tr.start) ? DateTime.strptime(date.to_s.gsub("/","-")+"T"+tr.start.strftime("%H:%M:%S%z"),"%FT%T%z") : nil
        reg_date.end = (tr.done) ? DateTime.strptime(date.to_s.gsub("/","-")+"T"+tr.start.strftime("%H:%M:%S%z"),"%FT%T%z") : nil
        
        reg_date.save
      end
    end
    
    #finally group lessons
    registration.registered_group_classes {|clss| clss.destroy }
    params[:groups].each do |date, opt|
      d = Date.parse(date)
      
      g_class = registration.registered_group_classes.new
      g_class.class_date = d
      
      g_class.save
    end
    
  end #def save
  
  
end
