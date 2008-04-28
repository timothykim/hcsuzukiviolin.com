class Option < ActiveRecord::Base
  validates_presence_of     :name
  validates_presence_of     :value
  validates_uniqueness_of   :name
  
  def to_label
    "#{self.name}"
  end

  def true?
    self.value == "true"
  end
  
end
