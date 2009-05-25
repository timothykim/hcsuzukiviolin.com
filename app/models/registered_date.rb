class RegisteredDate < ActiveRecord::Base
  belongs_to :registration

  def clean?
    not (self.start.nil? or self.end.nil?)
  end
end
