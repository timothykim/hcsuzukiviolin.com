class AdminController < ApplicationController
  include AuthenticatedSystem
  include OptionDictionary
  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required

  def index
    
  end
  
  
  def siteoptions

    #display current options
    
    
    
    #styles
    

  end
  
  
end
