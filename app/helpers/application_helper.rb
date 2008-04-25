# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def conditional_render_partial(partial)
    render_partial partial
  rescue ActionView::ActionViewError
    #don't render!
  end
  
  
  def avatar_thumbnail_path(avatar)
    if avatar.nil?
      return "/images/default_avatar.gif"
    else
      return avatar.public_filename(:thumb)
    end
  end
  
end
