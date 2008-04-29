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
  
  
  def get_current_theme_css(name="global")
    return "themes/" + Option.find(:first, :conditions => ["name = ?", option(:theme)]).value + "/#{name}"
  end
  
  
  
end
