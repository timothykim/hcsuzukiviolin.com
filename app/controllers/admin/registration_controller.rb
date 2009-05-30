class Admin::RegistrationController < AdminController

  def index
    @section_path = "Adminstration &raquo; "
    @section_title = "Registrations"

    @submenu = global_submenu

    @sessions = Session.find(:all, :conditions => {:is_active => true}, :order => "first DESC")
    @schools = School.all

    @javascripts = "tablesort.js"
  end

  def delete
    r = Registration.find(params[:id])
    r.destroy
  end

  def schedule
    @current_session = Session.find(params[:id]) 

    @teaching_hours = @current_session.weekly_availablities 

    @section_path = "Administration &raquo; Registrations &raquo; "
    @section_title = @current_session.name + " Schedule"

    @startdate = @current_session.first.next_week - 8 #start on sunday
    @enddate = @current_session.last.next_week - 2 #end on saturday
    @students = @current_session.students.sort {|x,y| x.last_name <=> y.last_name}
    
    @day_count = (@enddate - @startdate).to_i
    @week_count = (@day_count / 7.0).ceil

    @day_start = 7 #7 am
    @day_end = 21 #9 pm (last hour, meaning til 10pm)

    @registrations = @current_session.registrations.sort {|x,y| x.student.last_name <=> y.student.last_name} 

    @javascript_code = <<BLOCK
        var SESSION_ID = #{params[:id]};
        var DAY_START = #{@day_start};
        var DAY_END = #{@day_end};
        var NUMBER_OF_WEEKS = #{@week_count};
BLOCK

  end

  def add_lesson
    session[:return_to] = ""
    headers["Content-Type"] = "text/x-json; charset=utf-8"

    recurring = Registration.find(params[:registration_id]).session.registration_type == 0 

    lesson = Lesson.new
    lesson.attributes = { :registration_id => params[:registration_id],
                          :is_recurring => recurring,
                          :time => Time.at(params[:date].to_i),
                          :duration => params[:duration].to_i } 
    lesson.save

    render :text => lesson.to_json
  end

  def delete_lesson
    lesson = Lesson.find(params[:id])
    lesson.destroy
    render :text => "done"
  end


  def lessons_json
    session[:return_to] = ""
    headers["Content-Type"] = "text/x-json; charset=utf-8"
    
    lessons = Registration.find(params[:id]).lessons

    data = []
    
    lessons.each do |lesson|
      data << lesson.to_json_data
    end

    render :text => data.to_json
  end

  def get_json
    session[:return_to] = ""
    headers["Content-Type"] = "text/x-json; charset=utf-8"
    
    registration = Registration.find(params[:id])
    student = registration.student
    timeranges = []

    registered_timeranges = registration.registered_dates.find(:all, :conditions => ['"start" IS NOT NULL and "end" IS NOT NULL'])
    for timerange in registered_timeranges
      start = Time.local(timerange.date.year, timerange.date.month, timerange.date.day, timerange.start.hour, timerange.start.min).to_i
      finish = Time.local(timerange.date.year, timerange.date.month, timerange.date.day, timerange.end.hour, timerange.end.min).to_i
      timeranges << {:start => start, :finish => finish, :string => timerange.user_input, :preferred => timerange.preferred}
    end

    data = { :registration => registration, :student => student, :timeranges => timeranges, :color => Colors.one(registration.id) }

    render :text => data.to_json
  end

end
