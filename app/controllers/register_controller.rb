class RegisterController < ApplicationController
  before_filter :login_required
  
  def global_submenu
    [ { :name => "<img src=\"/images/icons/help.png\" class=\"icon\" /> Registration Help", :render => "help" } ]
  end
  
  
  def index
    @section_title = "Registrations"
    
    @submenu = global_submenu
    
    @sessions = Session.find(:all, :conditions => {:is_active => true}, :order => "first DESC")
  end
  
  def form    
    name = params[:session].gsub(/-/, ' ')
    
    @current_session = Session.find(:first, :conditions => { :name => name })
    
    @season = name.split()[0]
    @year = name.split()[1]

    @section_path = "Registrations &raquo; "
    @section_title = name
    @submenu = global_submenu
    
    #if current_user.is_admin or (Date.today < @current_session.first and @current_session.is_active)
    if current_user.is_admin or (@current_session.is_active)
      
      @student = Student.new
      @student = Student.find(params[:student]) if params[:student]
      
      #make sure parents aren't messing with other students
      @parent = current_user
      unless current_user.is_admin
        if params[:student]
          unless @student.user_id == @parent.id
            @error = "You have no privilege to modify this student's registration."
          end
        end
      else
        #if it's admin editing some other student's registration, then display parent's name
        if params[:student]
          @parent = User.find(@student.user_id)
        elsif params[:parent]
          @parent = User.find(params[:id])
        end
      end

      
      @registration = @student.current_or_new_registration @current_session
      

      @registration_options = @current_session.registration_options

      @schools = School.find(:all)

      if @current_session.registration_type == Session::DATE_TYPE
        @dates = @current_session.session_days.sort {|a,b| a.date <=> b.date} #make sure it's sorted, else doesn't work!
                                                                              # also this should NOT be empty

        #add buffer dates front and end so we start on sunday and end on saturday
        until @dates[0].date.wday() == 1
          #logger.debug "The object is #{@dates[0].to_yaml}"
          d = @dates[0].dup
          d.date -= 1
          d.offday = true
          @dates.insert(0, d)
        end
        until @dates[-1].date.wday() == 6
          d = @dates[-1].dup
          d.date += 1
          d.offday = true
          @dates.push(d)
        end
        
        
      else
        @r_days = []
        @registration.registered_days.each do |rd|
          s = rd.start
          while true do
            @r_days.push("d" + (rd.day - 1).to_s + "_" + s.strftime("%H:%M"))
            s += 30 * 60
            if rd.end == s
              break
            end
          end
        end
      end
      
      
      @group_days = @current_session.session_days.find(:all, :conditions => {:group => true}, :order => "date")
      
      @javascript_code = "var registration_id = " + (@registration.id || 0).to_s

    else
      @error = "<img src=\"/images/icons/exclamation.png\" class=\"icon\"/> Sorry, #{name} session is no longer accepting registration."
    end
  end
  
  
  def get_registered_date
    hash = {}
    
    dates = Registration.find(params[:id]).registered_dates
    
    dates.each do |date|
      hash[date.date.to_s] = [] unless hash[date.date.to_s]
      hash[date.date.to_s].push(date.user_input)
    end
    
    render :text => hash.to_json
  end
  
  
  def save
    
    current_session = Session.find(params[:session_id])

    #save the parent information
    parent = User.find(params[:parent][:id])
    parent.attributes = params[:parent]
    parent.email_confirmation = params[:parent][:email]
    parent.save
    
    #first deal with the student
    if params[:new]
      student = current_user.students.new
    else
      student = Student.find(params[:student][:id])
    end
    
    # student.first_name = params[:first_name]
    # student.middle_initial = params[:mi]
    # student.last_name = params[:last_name]
    # student.dob = Date.parse(params[:student]["dob(1i)"] + "/" + params[:student]["dob(2i)"] + "/" + params[:student]["dob(3i)"])
    # student.school = params[:student_school]
    # student.grade_level = params[:grade]
    # student.comment = params[:comment]
    student.attributes = params[:student]
    student.save
    
    
    #now register him!
    #first plain registration
    registration = student.registrations.find(:first, :conditions => {:session_id => current_session.id})
    unless registration
      registration = student.registrations.new
      registration.session_id = current_session.id
    end
    registration.attributes = params[:registration]
    registration.updated_at = Time.now
    registration.save
    
    #secondly the options
    if params[:reg_option] 
      registration.registered_options.each {|opt| opt.destroy }
      params[:reg_option].each do |id, value|
        option = registration.registered_options.new
        option.option_id = id
        option.value = value
        option.save
      end
    end
    
    #3rd, registered dates
    if current_session.registration_type == Session::DATE_TYPE
      registration.registered_dates.each {|date| date.destroy}
      params[:times].each do |date, times|
        times.split(/[,\n\r]+/).each do |time_str|
          reg_date = registration.registered_dates.new
          
          reg_date.user_input = time_str.strip
          if time_str.index('*')
            reg_date.preferred = true
          end
          time_str = time_str.gsub('*', '')
          
          tr = TimeRange.new(time_str)
          
          reg_date.start = tr.start
          reg_date.end = tr.done
          reg_date.date = Date.parse(date)
          
          reg_date.save
        end
      end
    else
      registration.registered_days.each {|day| day.destroy}
      #tokenize the input string
      params[:schedule_selection].gsub(/\s/,'').split(',').each do |time_str|
        reg_day = registration.registered_days.new
        # input 0 = monday but save as 1 = monday
        reg_day.day = time_str[1] - 47
        tr = TimeRange.new(time_str.split('-').map{|t| t[3..7]}.join('-'));
        reg_day.start = tr.start
        reg_day.end = tr.done
        reg_day.save
      end
    end
    
    
    if current_user.is_admin
      redirect_to :controller => 'admin/registration', :action => 'index'
    else
      redirect_to :action => 'notice', :id => current_session.id
    end
  end #def save
  
  def notice
    @section_path = "Registrations &raquo; "
    @section_title = "Thank You"
    @submenu = [ {:name => "<img src=\"/images/icons/write.png\" class=\"icon\" /> Registration Home", :link => "/register"} ]
  end
  
end
