class ParentsController < ApplicationController
  before_filter :login_required

  def global_submenu
    [ { :name => "<img src=\"/images/icons/settings.png\" class=\"icon\" /> My Account Setting", :link => "/parents/settings" }, { :name => "<img src=\"/images/icons/exclamation.png\" class=\"icon\" /> Semester Info", :link => "/parents/index" },
      { :name => "<img src=\"/images/icons/write.png\" class=\"icon\" /> My Registations", :link => "/register" },
      { :name => "<img src=\"/images/icons/music.png\" class=\"icon\" /> My Lessons", :link => "/parents/lessons" },
      { :name => "<img src=\"/images/icons/resources.png\" class=\"icon\" /> Resources", :link => "/parents/resources" },
      { :name => "<img src=\"/images/icons/calendar.png\" class=\"icon\" /> School Calendars", :link => "/page/calendar" },
      { :name => "<img src=\"/images/icons/group.png\" class=\"icon\" /> Group Class Info", :link => "/parents/group" },
      { :name => "<img src=\"/images/icons/heart.png\" class=\"icon\" /> Recitals", :link => "/parents/recitals" },
#      { :name => "<img src=\"/images/icons/discussion.png\" class=\"icon\" /> Online Discussions", :link => "index" },
      { :name => "<img src=\"/images/icons/directory.png\" class=\"icon\" /> Directory", :link => "/parents/directory" },
      { :name => "<img src=\"/images/icons/news.png\" class=\"icon\" /> Newsletters", :link => "/parents/newsletters" },
      { :name => "<img src=\"/images/icons/photobook.png\" class=\"icon\" /> Photobook", :link => "/photobook" },
    ]
  end

  def index
    @section_title = "For Current Parents"
    @submenu = global_submenu
    @content = Content.f("semester_information")
  end

  def recitals
    @section_title = "Recital Information"
    @submenu = global_submenu
    @content = Content.f("recital_information")
  end

  def rehearsal
    if params[:students]
      s = params[:students]
      s.each do |sid, rid|
        r = Rehearsal.find(rid)
        r.student_id = sid
        r.piece = params[:p][sid]
        r.save!
      end
    end

    @section_title = "Rehearsal Sign-up"
    @rehearsals = Rehearsal.find(:all, :order => "time")
    @user = self.current_user
    @students = @user.students
  end

  def resources
    @section_title = "Resources"
    @submenu = global_submenu
    @content = Content.f("parent_resources")
  end

  def group 
    @section_title = "Group Class Information"
    @submenu = global_submenu

    @sessions = Session.find(:all, :conditions => {:is_active => true}, :order => "first DESC")
    
    @groups = {}
    for session in @sessions
      @groups[session] = SessionDay.find(:all, :conditions => {:group => true, :session_id => session.id}, :order => "date")
    end

    @content = Content.f("group_info")
  end

  def directory
    @section_path = "For Current Parents &raquo; "
    @section_title = "Directory"
    @submenu = global_submenu

    #check if the user is registerd for current session
    
    @sessions = Session.find(:all, :conditions => "is_active = true")

    #@registrations = Session.current.registrations.sort {|x,y| x.student.user.lastname <=> y.student.user.lastname }

    @javascripts = "tablesort.js"
  end

  def settings
    @section_path = "For Current Parents &raquo; "
    @section_title = "My Account Settings"
    @submenu = global_submenu
    
    @user = self.current_user
    
    return unless params[:user]
    
    if @user.email == params[:user][:email] and params[:user][:email_confirmation] == ""
      params[:user][:email_confirmation] = params[:user][:email]
    end
    
    if params[:avatar][:uploaded_data]
      @user.avatar.destroy if @user.avatar
      Avatar.create!(params[:avatar])
    end
    
    if @user.update_attributes(params[:user])
      flash[:notice] = 'Your account settings have been saved.'
      redirect_to :action => 'settings'
    else
      render :action => "settings"
    end
  end

  def newsletters
    @section_path = "For Current Parents &raquo; "
    @section_title = "Newsletters"
    @submenu = global_submenu
  end

  def lessons
    @section_path = "For Current Parents &raquo; "
    @section_title = "My Lessons"
    @submenu = global_submenu

    @sessions = Session.find(:all, :conditions => {:is_active => true}, :order => "first DESC")

    # for pre-registration only
    #@sessions.shift

    @parent = current_user
    if params[:p]
      @parent = User.find(params[:p])
    end

  end

  def all_lessons
    @section_path = "For Current Parents &raquo; "
    @section_title = "All Lessons"
    @submenu = global_submenu
    @current_session = Session.find(params[:id])
    @user = self.current_user

    if @current_session.registration_type == Session::DAY_TYPE 
      @startdate = @current_session.first.next_week - 8 #start on sunday
      @enddate = @current_session.last.next_week - 2 #end on saturday
      @students = @current_session.students.sort {|x,y| x.last_name <=> y.last_name}

    else
      @startdate = @current_session.first.next_week - 8 #start on sunday
      @enddate = @current_session.last.next_week - 2 #end on saturday
      @students = @current_session.students.sort {|x,y| x.last_name <=> y.last_name}
      
      @day_count = (@enddate - @startdate).to_i
      @week_count = (@day_count / 7.0).ceil
    end

    @day_start = 7 #7 am
    @day_end = 21 #9 pm (last hour, meaning til 10pm)
  end
end
