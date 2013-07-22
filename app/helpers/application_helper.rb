# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  
  def conditional_render_partial(partial)
    render_partial partial
<<<<<<< HEAD
  rescue ActionView::ActionViewError
    #don't render!
  end
=======
  rescue
    #don't render!
  end

  def colors(id)
    c = [
      "CC3333",
      "DD4477",
      "994499",
      "6633CC",
      "336699",
      "3366CC",
      "22AA99",
      "329262",
      "0F9618",
      "66AA00",
      "AAAA11",
      "D6AE00",
      "EE8800",
      "DD5511",
      "A87070",
      "8C6D8C",
      "627487",
      "7083A8",
      "5C8D87",
      "898951",
      "B08B59"
    ]

    return c[id % c.length]
  end
>>>>>>> deploy
  
  
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
  
  
<<<<<<< HEAD
  
=======
  def get_css_class(controller)
    return controller.controller_path.split('/')[0] + " " + controller.controller_name + " " + controller.controller_name + "_" + controller.action_name
  end

>>>>>>> deploy
end
