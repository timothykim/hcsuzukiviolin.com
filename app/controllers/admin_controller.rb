class AdminController < ApplicationController
  include AuthenticatedSystem
  include OptionDictionary

  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required

  def global_submenu
    [
      { :name => '<img src="/images/icons/users.png" class="icon" /> Users', :link => "/admin/users", :selected => "selected" },
      { :name => '<img src="/images/icons/globe.png" class="icon" /> Site', :link => "#" },
      { :name => '<img src="/images/icons/announce.png" class="icon" /> Announcements', :link => "#" },
      { :name => '<img src="/images/icons/news.png" class="icon" /> Newsletter', :link => "#" }
    ]
  end


  def index
    @section_title = "Administration"
    @submenu = global_submenu
  end
  
  def users_list
    @section_path = "Adminitration &raquo; "
    @section_title = "Users"
    @submenu = global_submenu
  end
  
  
  def siteoptions

    #display current options
    
    
    
    #styles
    

  end
  
  
end
