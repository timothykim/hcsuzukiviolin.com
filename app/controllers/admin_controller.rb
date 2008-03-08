class AdminController < ApplicationController
  include AuthenticatedSystem
  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required

  def index
    
  end
  
  def users

  end
end
