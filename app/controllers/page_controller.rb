class PageController < ApplicationController
  include AuthenticatedSystem
  include DisplayHelper
  
  before_filter :login_from_cookie, :store_location
  
  def index
  end
  
  
  def jesuslovesme
    @section_title = "Jesus Love Me Download"
  end
  
  def illegal
    @section_title = "You can't do that!"
  end
  
end
