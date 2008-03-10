module OptionDictionary
  
  def option name
    {
      :theme => 'Theme',
      :sitename => 'Site Name'
    }[name]
  end
end