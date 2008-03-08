module DisplayHelper
  include OptionDictionary

  def get_current_theme_css
    return "themes/" + Option.find(:first, :conditions => ["name = ?", option(:theme)]).value + "/style"
  end
  
  def get_menu
    
  end
end
