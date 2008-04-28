module DisplayHelper
  include OptionDictionary

  def get_current_theme_css(name="global")
    return "themes/" + Option.find(:first, :conditions => ["name = ?", option(:theme)]).value + "/#{name}"
  end
  
  def get_menu
    
  end
end
