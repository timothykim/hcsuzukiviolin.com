class ParentsController < ApplicationController
  before_filter :login_required
  
  def global_submenu
    [ { :name => "<img src=\"/images/icons/settings.png\" class=\"icon\" /> My Account Setting", :link => "/parents/settings" },
      { :name => "<img src=\"/images/icons/face-smile.png\" class=\"icon\" /> My Students", :link => "index" },
      { :name => "<img src=\"/images/icons/write.png\" class=\"icon\" /> My Registations", :link => "/register" },
      { :name => "<img src=\"/images/icons/music.png\" class=\"icon\" /> My Lessons", :link => "/parents/lessons" },
      { :name => "<img src=\"/images/icons/calendar.png\" class=\"icon\" /> School Calendars", :link => "/parents/calendar" },
      { :name => "<img src=\"/images/icons/announce.png\" class=\"icon\" /> Announcements", :link => "index" },
      { :name => "<img src=\"/images/icons/discussion.png\" class=\"icon\" /> Online Discussions", :link => "index" },
      { :name => "<img src=\"/images/icons/news.png\" class=\"icon\" /> Newsletters", :link => "/parents/newsletters" },
      { :name => "<img src=\"/images/icons/photobook.png\" class=\"icon\" /> Photobook", :link => "/photobook" },
    ]
  end

  def index
    @section_title = "For Current Parents"
    @submenu = global_submenu
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
  end

  def all_lessons
    @section_path = "For Current Parents &raquo; "
    @section_title = "All Lessons"
    @current_session = Session.find(params[:id])

    @startdate = @current_session.first.next_week - 8 #start on sunday
    @enddate = @current_session.last.next_week - 2 #end on saturday
    @students = @current_session.students.sort {|x,y| x.last_name <=> y.last_name}
    
    @day_count = (@enddate - @startdate).to_i
    @week_count = (@day_count / 7.0).ceil

    @day_start = 7 #7 am
    @day_end = 21 #9 pm (last hour, meaning til 10pm)
  end
end
