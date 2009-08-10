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

    @teaching_hours = @current_session.weekly_availablities 

    @day_start = 7 #7 am
    @day_end = 21 #9 pm (last hour, meaning til 10pm)
    @javascript_code = <<BLOCK
        var SESSION_ID = #{params[:id]};
        var DAY_START = #{@day_start};
        var DAY_END = #{@day_end};
BLOCK

    @registrations = @current_session.registrations.sort {|x,y| x.student.last_name <=> y.student.last_name} 

    if @current_session.registration_type == Session::DATE_TYPE
      @startdate = @current_session.first.next_week - 8 #start on sunday
      @enddate = @current_session.last.next_week - 2 #end on saturday
      @students = @current_session.students.sort {|x,y| x.last_name <=> y.last_name}
      
      @day_count = (@enddate - @startdate).to_i
      @week_count = (@day_count / 7.0).ceil



      @r_hash = {}
      @current_session.registered_dates.find(:all, :conditions => ["start IS NOT NULL AND 'end' IS NOT NULL"]).each do |r|
        @r_hash[r.floor.to_i] = "" if @r_hash[r.floor.to_i].nil?
        @r_hash[r.floor.to_i] += r.to_img_bar(r.floor) + " "
      end

      @javascript_code += <<BLOCK
        var NUMBER_OF_WEEKS = #{@week_count};
        var SESSION_TYPE = "date";
BLOCK
    else
      @r_hash = {}
      @current_session.registered_days.find(:all).each do |r|
        hash_key = r.start_to_s
        @r_hash[hash_key] = "" if @r_hash[hash_key].nil?
        @r_hash[hash_key] += r.to_img_bar() + " "
      end
      @javascript_code += <<BLOCK
        var SESSION_TYPE = "weekday";
BLOCK

    end
  end

  def all_lessons_ical
    headers["Content-Type"] = "text/calendar; charset=utf-8"

    name = params[:id].gsub(/-/, ' ')
    @current_session = Session.find(:first, :conditions => { :name => name })

    ical = <<END_OF_STRING
BEGIN:VCALENDAR
METHOD:PUBLISH
X-WR-TIMEZONE:US/Eastern
PRODID:-//SUZUKI//Lessons//EN
X-WR-CALNAME:#{@current_session.name}
VERSION:2.0
END_OF_STRING

    for lesson in @current_session.lessons
      startstr = lesson.time.strftime("%Y%m%dT%H%M00")
      finishstr = Time.at(lesson.time.to_i + (lesson.duration * 60)).strftime("%Y%m%dT%H%M00")
      event_str = <<END_OF_EVENT
BEGIN:VEVENT
DTSTART;TZID=US/Eastern:#{startstr}
SUMMARY:#{lesson.registration.student}
DTEND;TZID=US/Eastern:#{finishstr}
END:VEVENT
END_OF_EVENT
      ical += event_str
    end

    ical += "END:VCALENDAR"

    render :text => ical
  end

  def add_lesson
    session[:return_to] = ""
    headers["Content-Type"] = "text/x-json; charset=utf-8"

    sess = Registration.find(params[:registration_id]).session
    recurring = sess.registration_type == 0 

    if recurring
      #use the the first week of the session
      if params[:date].to_i < sess.first.wday 
        params[:date] = ((sess.first.next_week - 1) + params[:date].to_i).to_s
      else
        params[:date] = ((sess.first.next_week - 8) + params[:date].to_i).to_s
      end
    end

    lesson_begin = Time.parse(params[:date] + " " + params[:time])
    lesson_end = Time.parse(params[:date] + " " + params[:time]) + (params[:duration].to_i * 60)

    bad = false
    Lesson.all.each do |s|
      start = s.time
      done = s.time + (s.duration * 60)
      if start <= lesson_begin and lesson_begin < done
        bad = true
        break
      end
      if lesson_begin <= start and start < lesson_end
        bad = true
        break
      end
    end

    if bad
      render :text => { :error => true }.to_json
    else
      lesson = Lesson.new
      lesson.attributes = { :registration_id => params[:registration_id],
                            :is_recurring => recurring,
                            :time => Time.parse(params[:date] + " " + params[:time]),
                            :duration => params[:duration].to_i } 
      lesson.save
      render :text => lesson.to_json
    end
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
      data << lesson.to_hash
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

    data = { :registration => registration, :student => student, :timeranges => timeranges, :color => Colors.one(registration.student.user_id) }

    render :text => data.to_json
  end

  def get_all
    session[:return_to] = ""
    headers["Content-Type"] = "text/x-json; charset=utf-8"

    current_session = Session.find(params[:id])

    if current_session.registration_type == Session::DATE_TYPE
      registered_timeranges = current_session.registered_dates.find(:all, :conditions => ['"start" IS NOT NULL and "end" IS NOT NULL'])
    else
      registered_timeranges = current_session.registered_days
    end

    registrations = {}
    registered_timeranges.each do |r|
      registrations[r.id] = r.to_hash
    end

    render :text => registrations.to_json
  end
end
