class PageController < ApplicationController
  include AuthenticatedSystem
  include DisplayHelper
  
  before_filter :store_location, :login_from_cookie
  
  def index
  end
  
  
  def jesuslovesme
    @section_title = "Music Downloads"
  end
  
  def illegal
    @section_title = "You can't do that!"
  end
  
end
