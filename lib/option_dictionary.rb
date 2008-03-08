module OptionDictionary
  
  def option name
    {
      :theme => 'theme',
    }[name]
  end
end