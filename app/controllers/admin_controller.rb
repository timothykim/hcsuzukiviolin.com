class AdminController < ApplicationController
  include AuthenticatedSystem
  include OptionDictionary
  
  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required


  def index
    @section_title = "Administration"
    @submenu = [
          { :name => "User Administration", :link => "/admin/users", :selected => "selected" },
          { :name => "Site Administration", :link => "#" },
          { :name => "News Administration", :link => "#" }
      ]
    
    
  end
  
  
  def siteoptions

    #display current options
    
    
    
    #styles
    

  end
  
  
end
