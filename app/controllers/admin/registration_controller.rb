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

    @section_path = "Administration &raquo; Registrations &raquo; "
    @section_title = @current_session.name + " Schedule"

    unit_height = 16.0;
    unit_time = 30 * 60.0;

    @startdate = @current_session.first.next_week - 8 #start on sunday
    @enddate = @current_session.last.next_week - 2 #end on saturday
    @students = @current_session.students
    
    @day_count = (@enddate - @startdate).to_i
    @week_count = (@day_count / 7.0).ceil

    @day_start = 7 #7 am
    @day_end = 21 #9 pm

    @student_lessons = {}
    for student in @students
      @student_lessons[student] = 0
    end

  end
end
