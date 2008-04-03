# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def conditional_render_partial(partial)
    render_partial partial
  rescue ActionView::ActionViewError
    #don't render!
  end
  
end
