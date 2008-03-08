class DisplayController < ApplicationController
  include AuthenticatedSystem
  include DisplayHelper
  
  before_filter :login_from_cookie, :store_location
  
  def index
  end
  
  
end
